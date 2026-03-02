import { getConfig, saveConfig } from "@/lib/kv";
import type { ConfigNegocio } from "@/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/config — Retorna la configuración actual del negocio.
 */
export async function GET(): Promise<NextResponse> {
    try {
        const config = await getConfig();
        return NextResponse.json(config);
    } catch (err) {
        console.error("[Config API] Error al leer configuración:", err);
        return NextResponse.json({ error: "No se pudo leer la configuración." }, { status: 500 });
    }
}

/**
 * POST /api/config — Guarda la nueva configuración del negocio.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = (await req.json()) as Partial<ConfigNegocio>;

        // Validaciones básicas
        if (
            body.margen_prov_1 === undefined ||
            body.margen_prov_2 === undefined ||
            body.whatsapp_vendedor === undefined ||
            body.mostrar_ars === undefined
        ) {
            return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
        }

        const config: ConfigNegocio = {
            margen_prov_1: Number(body.margen_prov_1),
            margen_prov_2: Number(body.margen_prov_2),
            whatsapp_vendedor: String(body.whatsapp_vendedor),
            mostrar_ars: Boolean(body.mostrar_ars),
        };

        await saveConfig(config);
        return NextResponse.json({ ok: true, config });
    } catch (err) {
        console.error("[Config API] Error al guardar configuración:", err);
        return NextResponse.json({ error: "No se pudo guardar la configuración." }, { status: 500 });
    }
}
