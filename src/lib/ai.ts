import { generateId } from "@/lib/utils";
import type { Producto, ProveedorId } from "@/types";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

/** Estructura retornada por el LLM antes de enriquecer con metadatos. */
interface ProductoRaw {
    marca: string;
    modelo: string;
    variantes: string[];
    precio_usd: number;
    precio_ars: number | null;
    condicion: "Nuevo" | "Usado" | "CPO" | "AS IS";
}

const SYSTEM_PROMPT = `Eres un sistema automatizado de extracción de datos para un e-commerce. Tu tarea es recibir un texto crudo de un mensaje de WhatsApp de proveedores de tecnología y devolver ÚNICAMENTE un objeto JSON válido con la clave "productos" que contenga un arreglo de objetos.

Reglas de extracción:
- Ignora saludos, reglas de garantía, cotizaciones de monedas o información general.
- Esquema esperado por producto:
{
  "marca": "String (Ej: Apple, Samsung. Infierela si no está explícita)",
  "modelo": "String (Ej: iPhone 15 Pro 128GB. Completa nombres abreviados como '14 128gb' a 'iPhone 14 128GB' por contexto)",
  "variantes": ["String"] (Array de colores o características extra, ej: ["Blue", "Silver"]),
  "precio_usd": Number (Precio en dólares como entero),
  "precio_ars": Number | null (Precio en pesos argentinos si existe, null si no),
  "condicion": "String ('Nuevo', 'Usado', 'CPO', 'AS IS'. Por defecto 'Nuevo')"
}
No agregues markdown (como \`\`\`json) al inicio o final. Responde solo con JSON puro.`;

/**
 * Envía el texto crudo del proveedor al LLM y retorna la lista de productos parseados y enriquecidos.
 */
export async function parsearListaPrecios(
    textoRaw: string,
    proveedor: ProveedorId
): Promise<Producto[]> {
    const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: SYSTEM_PROMPT,
        prompt: textoRaw,
    });

    let parsed: { productos: ProductoRaw[] };

    try {
        // Limpieza defensiva por si el LLM devuelve markdown de todos modos
        const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
        parsed = JSON.parse(clean);
    } catch {
        throw new Error(`El LLM no devolvió JSON válido: ${text.slice(0, 200)}`);
    }

    if (!Array.isArray(parsed.productos)) {
        throw new Error("El JSON retornado no contiene un array 'productos'.");
    }

    return parsed.productos.map((p) => ({
        ...p,
        id: generateId(),
        proveedor,
    }));
}
