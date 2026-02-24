import type { ConfigNegocio, Producto, ProveedorId } from "@/types";
import { kv } from "@vercel/kv";

// =============================================
// Constantes de claves de Redis / Vercel KV
// =============================================
export const KV_KEYS = {
    CONFIG: "config_negocio",
    STOCK_PROV_1: "stock:prov_1",
    STOCK_PROV_2: "stock:prov_2",
} as const;

/**
 * Valores por defecto para la configuración del negocio.
 */
const DEFAULT_CONFIG: ConfigNegocio = {
    cotizacion_usd: 1450,
    margen_prov_1: 1.15,
    margen_prov_2: 1.2,
    whatsapp_vendedor: "",
};

// =============================================
// Funciones de acceso a Config
// =============================================

/**
 * Lee la configuración del negocio desde KV. Si no existe, devuelve los valores por defecto.
 */
export async function getConfig(): Promise<ConfigNegocio> {
    const config = await kv.get<ConfigNegocio>(KV_KEYS.CONFIG);
    return config ?? DEFAULT_CONFIG;
}

/**
 * Guarda la configuración del negocio en KV.
 */
export async function saveConfig(config: ConfigNegocio): Promise<void> {
    await kv.set(KV_KEYS.CONFIG, config);
}

// =============================================
// Funciones de acceso a Stock
// =============================================

/**
 * Lee el stock de un proveedor desde KV. Devuelve un array vacío si no hay datos.
 */
export async function getStock(proveedor: ProveedorId): Promise<Producto[]> {
    const key = proveedor === "prov_1" ? KV_KEYS.STOCK_PROV_1 : KV_KEYS.STOCK_PROV_2;
    const stock = await kv.get<Producto[]>(key);
    return stock ?? [];
}

/**
 * Reemplaza el stock actual de un proveedor con la nueva lista de productos.
 */
export async function saveStock(proveedor: ProveedorId, productos: Producto[]): Promise<void> {
    const key = proveedor === "prov_1" ? KV_KEYS.STOCK_PROV_1 : KV_KEYS.STOCK_PROV_2;
    await kv.set(key, productos);
}

export { kv };
