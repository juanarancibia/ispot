import type { ConfigNegocio, Producto, ProveedorId } from "@/types";
import { kv } from "@vercel/kv";

const TAG = "[KV Store]";

// =============================================
// Constantes de claves de Redis / Vercel KV
// =============================================
export const KV_KEYS = {
    CONFIG: "config_negocio",
} as const;

/**
 * Valores por defecto para la configuración del negocio.
 */
const DEFAULT_CONFIG: ConfigNegocio = {
    margen_prov_1: 1.15,
    margen_prov_2: 1.2,
    margen_prov_3: 1.15,
    margen_prov_4: 1.15,
    margen_prov_5: 1.15,
    whatsapp_vendedor: "",
    mostrar_ars: true,
};

// =============================================
// Funciones de acceso a Config
// =============================================

/**
 * Lee la configuración del negocio desde KV. Si no existe, devuelve los valores por defecto.
 */
export async function getConfig(): Promise<ConfigNegocio> {
    console.log(`${TAG} Leyendo config desde KV (key: ${KV_KEYS.CONFIG})...`);
    const config = await kv.get<ConfigNegocio>(KV_KEYS.CONFIG);
    if (config) {
        console.log(`${TAG} ✅ Config encontrada:`, JSON.stringify(config));
    } else {
        console.log(`${TAG} ⚠️ Config no encontrada, usando defaults`);
    }
    return config ?? DEFAULT_CONFIG;
}

/**
 * Guarda la configuración del negocio en KV.
 */
export async function saveConfig(config: ConfigNegocio): Promise<void> {
    console.log(`${TAG} Guardando config en KV...`, JSON.stringify(config));
    await kv.set(KV_KEYS.CONFIG, config);
    console.log(`${TAG} ✅ Config guardada`);
}

// =============================================
// Funciones de acceso a Stock
// =============================================

/**
 * Lee el stock de un proveedor desde KV. Devuelve un array vacío si no hay datos.
 */
export async function getStock(proveedor: ProveedorId): Promise<Producto[]> {
    const key = `stock:${proveedor}`;
    console.log(`${TAG} Leyendo stock de ${proveedor} (key: ${key})...`);
    const stock = await kv.get<Producto[]>(key);
    console.log(`${TAG} Stock de ${proveedor}: ${stock ? `${stock.length} productos` : "null (vacío)"}`);
    return stock ?? [];
}

/**
 * Reemplaza el stock actual de un proveedor con la nueva lista de productos.
 */
export async function saveStock(proveedor: ProveedorId, productos: Producto[]): Promise<void> {
    const key = `stock:${proveedor}`;
    console.log(`${TAG} Guardando ${productos.length} productos para ${proveedor} (key: ${key})...`);
    await kv.set(key, productos);
    console.log(`${TAG} ✅ Stock guardado para ${proveedor}`);
}

export { kv };
