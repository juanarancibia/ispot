import CartSheet from "@/components/CartSheet";
import ProductGrid from "@/components/ProductGrid";
import { getConfig, getStock } from "@/lib/kv";
import { calcularPrecioFinal } from "@/lib/utils";
import type { ConfigNegocio, Producto, ProductoConPrecio } from "@/types";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic"; // Siempre leer datos frescos de KV

const DEFAULT_CONFIG: ConfigNegocio = {
  cotizacion_usd: 1450,
  margen_prov_1: 1.15,
  margen_prov_2: 1.2,
  whatsapp_vendedor: "",
};

/** Carga los datos desde KV con fallback ante errores de conexión (ej: dev sin KV real). */
async function cargarDatos(): Promise<{
  config: ConfigNegocio;
  stockProv1: Producto[];
  stockProv2: Producto[];
}> {
  try {
    const [config, stockProv1, stockProv2] = await Promise.all([
      getConfig(),
      getStock("prov_1"),
      getStock("prov_2"),
    ]);
    return { config, stockProv1, stockProv2 };
  } catch {
    console.warn("[HomePage] KV no disponible, usando datos por defecto.");
    return { config: DEFAULT_CONFIG, stockProv1: [], stockProv2: [] };
  }
}

export default async function HomePage() {
  const { config, stockProv1, stockProv2 } = await cargarDatos();

  // Combinar stocks y calcular el precio final en ARS
  const productos: ProductoConPrecio[] = [...stockProv1, ...stockProv2].map((p) => {
    const margen = p.proveedor === "prov_1" ? config.margen_prov_1 : config.margen_prov_2;
    return {
      ...p,
      precio_final_ars: calcularPrecioFinal(p.precio_usd, p.precio_ars, config.cotizacion_usd, margen),
    };
  });

  const totalProductos = productos.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">ISpot</span>
          </div>
          <span className="text-zinc-500 text-sm">
            {totalProductos} producto{totalProductos !== 1 ? "s" : ""} disponibles
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Tecnología de{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            primera
          </span>
        </h1>
        <p className="text-zinc-400 mt-3 text-lg max-w-xl">
          Stock actualizado diariamente. Precio en pesos, pagás en el momento del retiro.
        </p>
      </section>

      {/* Catálogo */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        {totalProductos === 0 ? (
          <div className="text-center py-28 text-zinc-600">
            <Package size={52} className="mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold text-zinc-500">Sin stock disponible</h2>
            <p className="text-sm mt-2">
              El catálogo se actualiza automáticamente cuando el proveedor envía una lista de precios.
            </p>
          </div>
        ) : (
          <ProductGrid productos={productos} />
        )}
      </main>

      {/* Carrito flotante — Client Component */}
      <CartSheet whatsappVendedor={config.whatsapp_vendedor} />
    </div>
  );
}
