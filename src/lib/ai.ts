import { generateId } from "@/lib/utils";
import type { Producto, ProveedorId } from "@/types";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const TAG = "[AI Parser]";

/** Estructura retornada por el LLM antes de enriquecer con metadatos. */
interface ProductoRaw {
    marca: string;
    modelo: string;
    categoria: string;
    variantes: string[];
    precio_usd: number;
    precio_ars: number | null;
    precio_manual_usd?: number | null;
    precio_manual_ars?: number | null;
    almacenamiento?: string;
    condicion: "Nuevo" | "Usado" | "CPO" | "AS IS";
}

// =============================================
// System Prompt
// =============================================

const SYSTEM_PROMPT = `Eres un sistema automatizado de extracción de datos para un e-commerce de tecnología en Argentina. Tu tarea es recibir un fragmento de un mensaje de WhatsApp de proveedores y devolver ÚNICAMENTE un objeto JSON válido.

REGLAS ESTRICTAS:
1. Devolvé un JSON con la clave "productos" conteniendo un array de objetos.
2. No agregues markdown (\`\`\`json) ni texto extra. Solo JSON puro.
3. Ignorá completamente: saludos, reglas de garantía, condiciones de pago, cotizaciones de moneda, políticas de cambio/devolución, líneas solo con emojis, y líneas de instrucciones.

ESQUEMA POR PRODUCTO:
{
  "marca": "String — Apple, Samsung, DJI, Nikon, Canon, Sigma, Xiaomi, etc. Inferila si no está explícita.",
  "modelo": "String — nombre COMPLETO. Ejemplos: 'iPhone 15 Pro 128GB', 'DJI Mini 4 Pro', 'Lente Sigma 35mm para Nikon'. Si el texto dice solo '14 128gb', completalo a 'iPhone 14 128GB' según la sección.",
  "categoria": "String — 'Smartphones', 'Tablets', 'Audio', 'Cámaras Fotográficas', 'Lentes de Fotografía', 'Drones', 'iPads', 'Computadoras MacBook Air y Pro', 'Consolas', 'Accesorios', etc. Inferila según el tipo. OJO: Para lentes separá la categoría o marca si podés (ej: si es Nikon, poné marca Nikon y categoria 'Lentes de Fotografía').",
  "variantes": ["String"] — Array de colores o características extra disponibles. Ejec: ["Black", "Silver"]. Vacío [] si no hay.",
  "precio_usd": Number — Precio en dólares como entero,
  "precio_ars": Number | null — Precio en pesos argentinos o null,
  "almacenamiento": "String | null — SÓLO si es MacBook, iPad, o Smartphone (ej: '256GB', '512GB', '1TB', '2TB'). null si no aplica.",
  "condicion": "String — Uno de: 'Nuevo', 'Usado', 'CPO', 'AS IS'."
}

CASOS ESPECIALES:
- Los colores en líneas separadas debajo de un producto (ej: "⚫ Black 100%", "🔵 Blue 92%") son variantes del producto inmediatamente anterior.
- Líneas tipo "📌 Consultar stock por colores" significan que no hay variantes conocidas — devolvé variantes: [].
- Líneas de promo mayorista (ej: "x10 unidades: USD 20 c/u") son productos separados con su precio unitario.
- Líneas de bulk pricing como "🎁X4 Fuente original usb c 20w $100 ($25 C/U)" — usá el precio total como precio_usd.
- Si un producto tiene un doble signo de dólar (ej: "$$1420"), ignorá el doble y usá 1420.
- Precios en formato tabular con tabs: el primer número es USD, el tercer número (con $ y separadores de miles) es ARS.

Si el fragmento no contiene productos (solo texto informativo), devolvé: {"productos": []}`;

// =============================================
// Section Splitting
// =============================================

/**
 * Divide el texto crudo del proveedor en fragmentos lógicos para procesamiento.
 *
 * Estrategia (Maximizando Paralelismo y Velocidad):
 * - Cortamos en pedazos pequeños (ej: ~50 líneas maximo) para que OpenAI tarde mucho menos por cada chunk
 *   (batching en paralelo). Al hacer chunks pequeños el LLM lo procesa a gran velocidad.
 * - Intentamos cortar en líneas vacías para no partir productos.
 */
export function splitEnSecciones(textoRaw: string): string[] {
    const lineas = textoRaw.split("\n");

    const chunks: string[] = [];
    let currentChunk: string[] = [];

    // Límite óptimo para velocidad paralela con gpt-4o-mini
    const TARGET_CHUNK_SIZE = 45; 
    const MAX_CHUNK_SIZE = 80;

    for (let i = 0; i < lineas.length; i++) {
        currentChunk.push(lineas[i]);
        
        // Si ya pasamos el target y hay linea vacía, cortamos
        if (currentChunk.length >= TARGET_CHUNK_SIZE && lineas[i].trim() === "") {
            chunks.push(currentChunk.join("\n"));
            currentChunk = [];
        } else if (currentChunk.length >= MAX_CHUNK_SIZE) {
            // Hard cutoff si no hay saltos de línea y el chunk se vuelve muy pesado
            chunks.push(currentChunk.join("\n"));
            currentChunk = [];
        }
    }

    if (currentChunk.length > 0 && currentChunk.join("").trim().length > 0) {
        chunks.push(currentChunk.join("\n"));
    }

    console.log(`${TAG} Texto dividido agresivamente en ${chunks.length} chunks miniatura para máximo paralelismo.`);
    return chunks;
}

// =============================================
// Retry Logic
// =============================================

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1000;

/**
 * Ejecuta una función con retry y backoff exponencial.
 */
async function conRetry<T>(
    fn: () => Promise<T>,
    label: string
): Promise<T> {
    let lastError: Error | null = null;

    for (let intento = 0; intento <= MAX_RETRIES; intento++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (intento < MAX_RETRIES) {
                const delay = BASE_DELAY_MS * Math.pow(2, intento);
                console.warn(
                    `${TAG} ⚠️ Intento ${intento + 1}/${MAX_RETRIES + 1} falló para "${label}": ${lastError.message}. Reintentando en ${delay}ms...`
                );
                await new Promise((r) => setTimeout(r, delay));
            }
        }
    }

    throw lastError!;
}

// =============================================
// Per-chunk LLM Processing
// =============================================

/**
 * Procesa un fragmento individual de texto con el LLM.
 * Retorna los productos crudos extraídos.
 */
async function procesarChunk(
    chunk: string,
    chunkIndex: number,
    totalChunks: number
): Promise<ProductoRaw[]> {
    const label = `chunk ${chunkIndex + 1}/${totalChunks}`;
    console.log(`${TAG} 🔄 Procesando ${label} (${chunk.length} chars)...`);

    const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: SYSTEM_PROMPT,
        prompt: chunk,
    });

    console.log(`${TAG} ✅ ${label} — respuesta recibida (${text.length} chars)`);

    // Limpieza defensiva por si el LLM devuelve markdown
    const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    if (clean !== text.trim()) {
        console.log(`${TAG} ⚠️ Se limpió markdown del response en ${label}`);
    }

    let parsed: { productos: ProductoRaw[] };

    try {
        parsed = JSON.parse(clean);
    } catch {
        console.error(`${TAG} ❌ JSON inválido en ${label}. Raw: ${text.slice(0, 300)}`);
        throw new Error(`JSON inválido en ${label}`);
    }

    if (!Array.isArray(parsed.productos)) {
        console.error(`${TAG} ❌ Sin array 'productos' en ${label}. Keys: ${Object.keys(parsed).join(", ")}`);
        throw new Error(`Sin array 'productos' en ${label}`);
    }

    console.log(`${TAG} ✅ ${label} → ${parsed.productos.length} productos`);
    return parsed.productos;
}

// =============================================
// Deduplication
// =============================================

/**
 * Genera una clave de dedup para un producto (marca + modelo + precio).
 */
function deduplicationKey(p: ProductoRaw): string {
    return `${p.marca.toLowerCase()}|${p.modelo.toLowerCase()}|${p.precio_usd}`;
}

/**
 * Elimina productos duplicados, manteniendo el que tenga más variantes.
 */
function deduplicar(productos: ProductoRaw[]): ProductoRaw[] {
    const map = new Map<string, ProductoRaw>();

    for (const p of productos) {
        const key = deduplicationKey(p);
        const existing = map.get(key);
        if (!existing || p.variantes.length > existing.variantes.length) {
            map.set(key, p);
        }
    }

    const deduplicados = Array.from(map.values());
    const removidos = productos.length - deduplicados.length;
    if (removidos > 0) {
        console.log(`${TAG} 🧹 Deduplicación: ${removidos} duplicados eliminados`);
    }

    return deduplicados;
}

// =============================================
// Public API
// =============================================

/**
 * Parsea una lista de precios de un proveedor usando un pipeline chunked.
 *
 * 1. Divide el texto en secciones lógicas.
 * 2. Envía cada sección al LLM de forma independiente.
 * 3. Retry en cada chunk individual — fallos parciales no abortan todo.
 * 4. Deduplica y enriquece con IDs y proveedor.
 */
export async function parsearListaPrecios(
    textoRaw: string,
    proveedor: ProveedorId
): Promise<Producto[]> {
    console.log(`${TAG} ========== INICIO PARSEO ==========`);
    console.log(`${TAG} Proveedor: ${proveedor}`);
    console.log(`${TAG} Input: ${textoRaw.length} chars, ${textoRaw.split("\n").length} líneas`);

    const startTime = Date.now();

    // Step 1: Split en secciones
    const secciones = splitEnSecciones(textoRaw);
    console.log(`${TAG} ${secciones.length} secciones a procesar`);

    // Step 2: Procesar secciones en paralelo con retry individual
    const resultados = await Promise.allSettled(
        secciones.map((seccion, i) =>
            conRetry(
                () => procesarChunk(seccion, i, secciones.length),
                `sección ${i + 1}`
            )
        )
    );

    const resultadosChunks: ProductoRaw[][] = [];
    const errores: { chunk: number; error: string }[] = [];

    for (let i = 0; i < resultados.length; i++) {
        const resultado = resultados[i];
        if (resultado.status === "fulfilled") {
            resultadosChunks.push(resultado.value);
        } else {
            const msg = resultado.reason instanceof Error ? resultado.reason.message : String(resultado.reason);
            console.error(`${TAG} ❌ Sección ${i + 1} falló permanentemente: ${msg}`);
            errores.push({ chunk: i + 1, error: msg });
        }
    }

    // Step 3: Flatten y deduplicar
    const todosRaw = resultadosChunks.flat();
    console.log(`${TAG} Total raw: ${todosRaw.length} productos de ${resultadosChunks.length} secciones exitosas`);

    const deduplicados = deduplicar(todosRaw);

    // Step 4: Enriquecer con ID y proveedor
    const productos: Producto[] = deduplicados.map((p) => ({
        ...p,
        id: generateId(),
        proveedor,
    }));

    const elapsed = Date.now() - startTime;
    console.log(`${TAG} ========== FIN PARSEO ==========`);
    console.log(`${TAG} ✅ ${productos.length} productos finales en ${elapsed}ms`);
    if (errores.length > 0) {
        console.warn(`${TAG} ⚠️ ${errores.length} secciones fallaron:`, errores);
    }
    console.log(`${TAG} Resumen:`, JSON.stringify(productos.map(p => ({
        marca: p.marca,
        modelo: p.modelo,
        precio_usd: p.precio_usd,
        condicion: p.condicion,
        variantes: p.variantes,
    })), null, 2));

    return productos;
}
