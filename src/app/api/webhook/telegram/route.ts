import { parsearListaPrecios } from "@/lib/ai";
import { saveStock } from "@/lib/kv";
import type { ProveedorId } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

const TAG = "[Telegram Webhook]";

/**
 * Detecta el proveedor basado en el contenido del mensaje.
 */
function detectarProveedor(texto: string): ProveedorId | null {
    const textoLower = texto.toLowerCase();
    if (texto.startsWith("/prov1") || textoLower.includes("cotización del momento")) {
        console.log(`${TAG} Proveedor detectado: prov_1 (match: ${texto.startsWith("/prov1") ? "/prov1 command" : "cotización del momento"})`);
        return "prov_1";
    }
    if (texto.startsWith("/prov2") || textoLower.includes("lista de precios actualizada")) {
        console.log(`${TAG} Proveedor detectado: prov_2 (match: ${texto.startsWith("/prov2") ? "/prov2 command" : "lista de precios actualizada"})`);
        return "prov_2";
    }
    console.log(`${TAG} No se detectó proveedor. Texto no matchea ningún patrón. Primeros 200 chars: "${texto.slice(0, 200)}"`);
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

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log(`${TAG} ========== INCOMING WEBHOOK REQUEST ==========`);
    console.log(`${TAG} URL: ${req.url}`);
    console.log(`${TAG} Method: ${req.method}`);
    console.log(`${TAG} Headers:`, Object.fromEntries(req.headers.entries()));

    // Validar el secret para asegurar que la request viene de Telegram
    const secret = req.nextUrl.searchParams.get("secret");
    console.log(`${TAG} Secret recibido: "${secret}"`);
    console.log(`${TAG} Secret esperado: "${WEBHOOK_SECRET}"`);
    console.log(`${TAG} WEBHOOK_SECRET env var defined: ${!!WEBHOOK_SECRET}`);

    if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
        console.warn(`${TAG} ❌ UNAUTHORIZED - secret mismatch. Recibido: "${secret}", Esperado: "${WEBHOOK_SECRET}"`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(`${TAG} ✅ Secret válido`);

    let body: Record<string, unknown>;

    try {
        body = await req.json();
        console.log(`${TAG} Body recibido:`, JSON.stringify(body, null, 2));
    } catch (err) {
        console.error(`${TAG} ❌ Error parseando JSON body:`, err);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Telegram puede enviar diferentes tipos de updates
    const message = body?.message as Record<string, unknown> | undefined;
    const editedMessage = body?.edited_message as Record<string, unknown> | undefined;
    const channelPost = body?.channel_post as Record<string, unknown> | undefined;

    console.log(`${TAG} Update type: ${message ? "message" : editedMessage ? "edited_message" : channelPost ? "channel_post" : "unknown"}`);
    console.log(`${TAG} Update keys: ${Object.keys(body).join(", ")}`);

    // Usar message, edited_message, o channel_post
    const relevantMessage = message || editedMessage || channelPost;

    if (!relevantMessage) {
        console.warn(`${TAG} ⚠️ No message/edited_message/channel_post found in update. Full body:`, JSON.stringify(body));
        return NextResponse.json({ ok: true });
    }

    const texto = relevantMessage.text as string | undefined;
    const caption = relevantMessage.caption as string | undefined;
    const chat = relevantMessage.chat as { id: number } | undefined;
    const chatId = chat?.id;

    console.log(`${TAG} Chat ID: ${chatId}`);
    console.log(`${TAG} Has text: ${!!texto} (length: ${texto?.length ?? 0})`);
    console.log(`${TAG} Has caption: ${!!caption} (length: ${caption?.length ?? 0})`);
    console.log(`${TAG} Text preview: "${(texto ?? caption ?? "").slice(0, 300)}"`);

    const contenido = texto ?? caption;

    if (!contenido || !chatId) {
        console.warn(`${TAG} ⚠️ Mensaje sin texto/caption o sin chatId — ignorando. texto=${!!texto}, caption=${!!caption}, chatId=${chatId}`);
        return NextResponse.json({ ok: true });
    }

    const proveedor = detectarProveedor(contenido);

    if (!proveedor) {
        console.log(`${TAG} ℹ️ No es un mensaje de lista de precios — ignorando`);
        return NextResponse.json({ ok: true });
    }

    try {
        console.log(`${TAG} 🔄 Procesando lista de precios para ${proveedor}...`);
        console.log(`${TAG} Enviando a OpenAI (${contenido.length} caracteres)...`);
        const productos = await parsearListaPrecios(contenido, proveedor);
        console.log(`${TAG} ✅ OpenAI retornó ${productos.length} productos:`, JSON.stringify(productos, null, 2));

        console.log(`${TAG} Guardando en KV...`);
        await saveStock(proveedor, productos);
        console.log(`${TAG} ✅ Stock guardado en KV`);

        const nombreProv = proveedor === "prov_1" ? "Proveedor 1" : "Proveedor 2";
        await responderTelegram(
            chatId,
            `✅ Stock actualizado: ${productos.length} productos insertados para ${nombreProv}.`
        );
    } catch (err) {
        console.error(`${TAG} ❌ Error procesando lista:`, err);
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

    console.log(`${TAG} ========== WEBHOOK REQUEST COMPLETE ==========`);
    return NextResponse.json({ ok: true });
}
