import { kv } from "@/lib/kv";
import { NextResponse } from "next/server";
import type { ProveedorId } from "@/types";

const PROVIDERS: ProveedorId[] = ["prov_1", "prov_2", "prov_3", "prov_4", "prov_5"];

/**
 * POST /api/reset-db
 * Elimina la lista de stock de todos los proveedores.
 */
export async function POST(): Promise<NextResponse> {
    try {
        await Promise.all(
            PROVIDERS.map((prov) => kv.del(`stock:${prov}`))
        );

        return NextResponse.json({ success: true, message: "Base de datos reseteada correctamente." });
    } catch (err) {
        console.error("[Reset DB API] Error al resetear db:", err);
        return NextResponse.json({ error: "No se pudo resetear la base de datos." }, { status: 500 });
    }
}
