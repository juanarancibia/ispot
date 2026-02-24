import { parsearListaPrecios } from "@/lib/ai";
import { saveStock } from "@/lib/kv";
import type { ProveedorId } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

/**
 * Detecta el proveedor basado en el contenido del mensaje.
 */
function detectarProveedor(texto: string): ProveedorId | null {
    const textoLower = texto.toLowerCase();
    if (texto.startsWith("/prov1") || textoLower.includes("cotización del momento")) {
        return "prov_1";
    }
    if (texto.startsWith("/prov2") || textoLower.includes("lista de precios actualizada")) {
        return "prov_2";
    }
    return null;
}

/**
 * Envía un mensaje de respuesta al chat de Telegram.
 */
async function responderTelegram(chatId: number, texto: string): Promise<void> {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: texto }),
    });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    // Validar el secret para asegurar que la request viene de Telegram
    const secret = req.nextUrl.searchParams.get("secret");
    if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: {
        message?: {
            text?: string;
            chat?: { id: number };
        };
    };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const texto = body?.message?.text;
    const chatId = body?.message?.chat?.id;

    if (!texto || !chatId) {
        // Mensaje sin texto — ignorar silenciosamente (ej: stickers, fotos)
        return NextResponse.json({ ok: true });
    }

    const proveedor = detectarProveedor(texto);

    if (!proveedor) {
        // No es un mensaje de lista de precios, ignorar
        return NextResponse.json({ ok: true });
    }

    try {
        const productos = await parsearListaPrecios(texto, proveedor);
        await saveStock(proveedor, productos);

        const nombreProv = proveedor === "prov_1" ? "Proveedor 1" : "Proveedor 2";
        await responderTelegram(
            chatId,
            `✅ Stock actualizado: ${productos.length} productos insertados para ${nombreProv}.`
        );
    } catch (err) {
        console.error("[Telegram Webhook] Error procesando lista:", err);
        await responderTelegram(
            chatId,
            "❌ Error al procesar la lista de precios. Revisá el formato e intentá de nuevo."
        );
    }

    return NextResponse.json({ ok: true });
}
