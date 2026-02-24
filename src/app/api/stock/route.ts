import { getStock } from "@/lib/kv";
import type { ProveedorId } from "@/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/stock?proveedor=prov_1|prov_2 — Retorna el stock de un proveedor.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    const proveedor = req.nextUrl.searchParams.get("proveedor") as ProveedorId | null;

    if (!proveedor || (proveedor !== "prov_1" && proveedor !== "prov_2")) {
        return NextResponse.json(
            { error: "Parámetro 'proveedor' inválido. Usar 'prov_1' o 'prov_2'." },
            { status: 400 }
        );
    }

    try {
        const stock = await getStock(proveedor);
        return NextResponse.json(stock);
    } catch (err) {
        console.error("[Stock API] Error al leer stock:", err);
        return NextResponse.json({ error: "No se pudo leer el stock." }, { status: 500 });
    }
}
