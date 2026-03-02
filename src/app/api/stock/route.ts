import { getStock, saveStock } from "@/lib/kv";
import type { Producto, ProveedorId } from "@/types";
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

/**
 * PUT /api/stock — Actualiza un producto existente en el stock.
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        const { proveedor, ...producto } = body as Producto & { proveedor: ProveedorId };

        if (!proveedor || (proveedor !== "prov_1" && proveedor !== "prov_2")) {
            return NextResponse.json({ error: "Proveedor inválido." }, { status: 400 });
        }

        const stock = await getStock(proveedor);
        const index = stock.findIndex((p) => p.id === producto.id);

        if (index === -1) {
            return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
        }

        stock[index] = { ...stock[index], ...producto, proveedor };
        await saveStock(proveedor, stock);

        return NextResponse.json({ success: true, producto: stock[index] });
    } catch (err) {
        console.error("[Stock API] Error al actualizar stock:", err);
        return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
    }
}

/**
 * DELETE /api/stock?proveedor=prov_1&id=123 — Elimina un producto del stock.
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const proveedor = req.nextUrl.searchParams.get("proveedor") as ProveedorId | null;
    const id = req.nextUrl.searchParams.get("id");

    if (!proveedor || (proveedor !== "prov_1" && proveedor !== "prov_2")) {
        return NextResponse.json({ error: "Proveedor inválido." }, { status: 400 });
    }
    if (!id) {
        return NextResponse.json({ error: "Falta ID del producto." }, { status: 400 });
    }

    try {
        const stock = await getStock(proveedor);
        const newStock = stock.filter((p) => p.id !== id);

        if (stock.length === newStock.length) {
            return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
        }

        await saveStock(proveedor, newStock);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Stock API] Error al borrar stock:", err);
        return NextResponse.json({ error: "Error al borrar." }, { status: 500 });
    }
}
