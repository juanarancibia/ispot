import { KV_KEYS, kv } from "@/lib/kv";
import { NextResponse } from "next/server";

/**
 * POST /api/reset-db
 * Elimina la lista de stock de todos los proveedores.
 */
export async function POST(): Promise<NextResponse> {
    try {
        await kv.del(KV_KEYS.STOCK_PROV_1);
        await kv.del(KV_KEYS.STOCK_PROV_2);

        return NextResponse.json({ success: true, message: "Base de datos reseteada correctamente." });
    } catch (err) {
        console.error("[Reset DB API] Error al resetear db:", err);
        return NextResponse.json({ error: "No se pudo resetear la base de datos." }, { status: 500 });
    }
}
