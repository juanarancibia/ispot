import { parsearListaPrecios } from "@/lib/ai";
import { saveStock } from "@/lib/kv";
import type { ProveedorId } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

const TAG = "[Telegram Webhook]";

// =============================================
// Update-ID deduplication (prevents re-processing
// the same Telegram message on webhook retries)
// =============================================

interface ProcessedEntry {
    timestamp: number;
}

/** In-memory set of already-processed Telegram update_ids. */
const processedUpdates = new Map<number, ProcessedEntry>();

/** How long to remember an update_id (10 minutes). */
const DEDUP_TTL_MS = 10 * 60 * 1000;

/** Max entries before forcing a cleanup pass. */
const DEDUP_MAX_SIZE = 500;

/**
 * Purge entries older than DEDUP_TTL_MS.
 * Called lazily so it never blocks a hot path.
 */
function purgeStaleEntries(): void {
    const now = Date.now();
    for (const [id, entry] of processedUpdates) {
        if (now - entry.timestamp > DEDUP_TTL_MS) {
            processedUpdates.delete(id);
        }
    }
}

/**
 * Returns true if this update_id has already been seen.
 * Automatically registers it if not.
 */
function isDuplicate(updateId: number): boolean {
    if (processedUpdates.size > DEDUP_MAX_SIZE) {
        purgeStaleEntries();
    }

    if (processedUpdates.has(updateId)) {
        return true;
    }

    processedUpdates.set(updateId, { timestamp: Date.now() });
    return false;
}

// =============================================
// Helpers
// =============================================

/**
 * Detecta el proveedor basado en el contenido del mensaje.
 * Permite formatos como "/prov1", "/prov 2", "/proveedor 3", "/proveedor5"
 */
function detectarProveedor(texto: string): ProveedorId | null {
    const textoLower = texto.toLowerCase();
    
    // Buscar regex para /provN o /proveedor N
    // Ejemplos válidos: /prov1, /prov 2, /proveedor 3, /proveedor4
    const match = textoLower.match(/\/(?:prov|proveedor)\s*([1-5])/);
    if (match && match[1]) {
        const num = match[1]; // "1", "2", "3", "4", "5"
        console.log(`${TAG} Proveedor detectado dinámicamente: prov_${num}`);
        return `prov_${num}` as ProveedorId;
    }

    // Compatibilidad vieja (por si lo mandan sin comando pero tiene la frase clave)
    if (textoLower.includes("cotización del momento")) return "prov_1";
    if (textoLower.includes("lista de precios actualizada")) return "prov_2";

    console.log(`${TAG} No se detectó proveedor. Primeros 200 chars: "${texto.slice(0, 200)}"`);
    return null;
}

/**
 * Envía un mensaje de respuesta al chat de Telegram.
 */
async function responderTelegram(chatId: number, texto: string): Promise<void> {
    console.log(`${TAG} Respondiendo a chat ${chatId}: "${texto}"`);
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: texto }),
    });
    if (!res.ok) {
        const errBody = await res.text();
        console.error(`${TAG} Error enviando respuesta a Telegram. Status: ${res.status}, Body: ${errBody}`);
    } else {
        console.log(`${TAG} Respuesta enviada exitosamente a chat ${chatId}`);
    }
}

// =============================================
// Background processing (fire-and-forget)
// =============================================

/**
 * Processes the supplier price list in the background.
 * This runs AFTER the webhook has already returned 200 to Telegram.
 */
async function procesarEnBackground(
    contenido: string,
    proveedor: ProveedorId,
    chatId: number,
    updateId: number
): Promise<void> {
    try {
        console.log(`${TAG} 🔄 [BG update_id=${updateId}] Procesando lista de precios para ${proveedor}...`);
        console.log(`${TAG} [BG] Enviando a OpenAI (${contenido.length} caracteres)...`);
        const productos = await parsearListaPrecios(contenido, proveedor);
        console.log(`${TAG} ✅ [BG] OpenAI retornó ${productos.length} productos`);

        console.log(`${TAG} [BG] Guardando en KV para ${proveedor}...`);
        await saveStock(proveedor, productos);
        console.log(`${TAG} ✅ [BG] Stock guardado en KV`);

        await responderTelegram(
            chatId,
            `✅ Stock actualizado: ${productos.length} productos insertados para el Proveedor ${proveedor.replace("prov_", "")}.`
        );
    } catch (err) {
        console.error(`${TAG} ❌ [BG update_id=${updateId}] Error procesando lista:`, err);
        if (err instanceof Error) {
            console.error(`${TAG} Error name: ${err.name}`);
            console.error(`${TAG} Error message: ${err.message}`);
            console.error(`${TAG} Error stack: ${err.stack}`);
        }
        await responderTelegram(
            chatId,
            "❌ Error al procesar la lista de precios. Revisá el formato e intentá de nuevo."
        );
    }
    console.log(`${TAG} ========== [BG update_id=${updateId}] PROCESSING COMPLETE ==========`);
}

// =============================================
// Webhook handler
// =============================================

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log(`${TAG} ========== INCOMING WEBHOOK REQUEST ==========`);

    // ---- Auth ----
    const secret = req.nextUrl.searchParams.get("secret");
    if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
        console.warn(`${TAG} ❌ UNAUTHORIZED - secret mismatch`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ---- Parse body ----
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch (err) {
        console.error(`${TAG} ❌ Error parseando JSON body:`, err);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // ---- Deduplication on update_id ----
    const updateId = body.update_id as number | undefined;
    if (updateId != null && isDuplicate(updateId)) {
        console.warn(`${TAG} ⚠️ update_id ${updateId} ya fue procesado — ignorando duplicado`);
        return NextResponse.json({ ok: true });
    }
    console.log(`${TAG} update_id=${updateId} (nuevo)`);

    // ---- Extract message ----
    const message = body?.message as Record<string, unknown> | undefined;
    const editedMessage = body?.edited_message as Record<string, unknown> | undefined;
    const channelPost = body?.channel_post as Record<string, unknown> | undefined;

    console.log(`${TAG} Update type: ${message ? "message" : editedMessage ? "edited_message" : channelPost ? "channel_post" : "unknown"}`);

    const relevantMessage = message || editedMessage || channelPost;
    if (!relevantMessage) {
        console.warn(`${TAG} ⚠️ No message found in update — ignorando`);
        return NextResponse.json({ ok: true });
    }

    const texto = relevantMessage.text as string | undefined;
    const caption = relevantMessage.caption as string | undefined;
    const chat = relevantMessage.chat as { id: number } | undefined;
    const chatId = chat?.id;

    console.log(`${TAG} Chat ID: ${chatId}`);
    console.log(`${TAG} Text preview: "${(texto ?? caption ?? "").slice(0, 200)}"`);

    const contenido = texto ?? caption;
    if (!contenido || !chatId) {
        console.warn(`${TAG} ⚠️ Sin texto/caption o sin chatId — ignorando`);
        return NextResponse.json({ ok: true });
    }

    // ---- Detect provider ----
    const proveedor = detectarProveedor(contenido);
    if (!proveedor) {
        console.log(`${TAG} ℹ️ No se detectó comando de proveedor — avisando al usuario`);
        // This is fast so we can await it before responding
        await responderTelegram(
            chatId,
            "⚠️ No se detectó a qué proveedor pertenece esta lista.\n\nPor favor, asegurate de incluir `/prov1` (hasta `/prov5`) al inicio de tu mensaje y volvé a enviarlo."
        );
        return NextResponse.json({ ok: true });
    }

    // ---- Respond immediately, process in background ----
    // We fire the heavy LLM work without awaiting so Telegram gets its 200 OK fast.
    // This prevents Telegram from retrying the webhook while we're still processing.
    console.log(`${TAG} ✅ Respondiendo 200 OK a Telegram — procesando en background`);

    // Fire-and-forget: the promise runs in the background.
    // We catch errors inside procesarEnBackground so this won't cause unhandled rejections.
    procesarEnBackground(contenido, proveedor, chatId, updateId ?? 0);

    return NextResponse.json({ ok: true });
}
