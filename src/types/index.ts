// ============================================================
// Tipos compartidos del dominio de ISpot
// ============================================================

/**
 * Configuración global del negocio, almacenada en KV como `config_negocio`.
 */
export interface ConfigNegocio {
  margen_prov_1: number;
  margen_prov_2: number;
  margen_prov_3: number;
  margen_prov_4: number;
  margen_prov_5: number;
  whatsapp_vendedor: string;
  mostrar_ars: boolean;
}

/**
 * Condición del producto.
 */
export type CondicionProducto = "Nuevo" | "Usado" | "CPO" | "AS IS";

/**
 * Proveedor del producto.
 */
export type ProveedorId = "prov_1" | "prov_2" | "prov_3" | "prov_4" | "prov_5";

/**
 * Producto tal como se almacena en KV (stock:prov_1 / stock:prov_2).
 */
export interface Producto {
  id: string;
  marca: string;
  modelo: string;
  categoria: string;
  variantes: string[];
  precio_usd: number;
  precio_ars: number | null;
  precio_manual_usd?: number | null;
  precio_manual_ars?: number | null;
  almacenamiento?: string;
  condicion: CondicionProducto;
  proveedor: ProveedorId;
}

/**
 * Producto enriquecido con el precio final calculado para mostrar en el frontend.
 */
export interface ProductoConPrecio extends Producto {
  precio_final_usd: number;
  precio_final_ars: number | null;
  imagen?: string;
}

/**
 * Ítem dentro del carrito de compras.
 */
export interface ItemCarrito {
  producto: ProductoConPrecio;
  varianteSeleccionada: string | null;
  cantidad: number;
}
