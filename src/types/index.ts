// ============================================================
// Tipos compartidos del dominio de ISpot
// ============================================================

/**
 * Configuración global del negocio, almacenada en KV como `config_negocio`.
 */
export interface ConfigNegocio {
  cotizacion_usd: number;
  margen_prov_1: number;
  margen_prov_2: number;
  whatsapp_vendedor: string;
}

/**
 * Condición del producto.
 */
export type CondicionProducto = "Nuevo" | "Usado" | "CPO" | "AS IS";

/**
 * Proveedor del producto.
 */
export type ProveedorId = "prov_1" | "prov_2";

/**
 * Producto tal como se almacena en KV (stock:prov_1 / stock:prov_2).
 */
export interface Producto {
  id: string;
  marca: string;
  modelo: string;
  variantes: string[];
  precio_usd: number;
  precio_ars: number | null;
  condicion: CondicionProducto;
  proveedor: ProveedorId;
}

/**
 * Producto enriquecido con el precio final calculado para mostrar en el frontend.
 */
export interface ProductoConPrecio extends Producto {
  precio_final_ars: number;
}

/**
 * Ítem dentro del carrito de compras.
 */
export interface ItemCarrito {
  producto: ProductoConPrecio;
  varianteSeleccionada: string | null;
  cantidad: number;
}
