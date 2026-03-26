import CartSheet from "@/components/CartSheet";
import ProductGrid from "@/components/ProductGrid";
import { getConfig, getStock } from "@/lib/kv";
import { MOCK_STOCK_PROV_1, MOCK_STOCK_PROV_2 } from "@/lib/mockData";
import { calcularPrecioFinal } from "@/lib/utils";
import { getProductImageServerFallback } from "@/lib/serverUtils";
import type { ConfigNegocio, Producto, ProductoConPrecio } from "@/types";
import { Shield, Smartphone, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

const DEFAULT_CONFIG: ConfigNegocio = {
  margen_prov_1: 1.15,
  margen_prov_2: 1.2,
  whatsapp_vendedor: "",
  mostrar_ars: true,
};

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
    console.warn("[HomePage] KV no disponible, usando datos mock.");
    return { config: DEFAULT_CONFIG, stockProv1: MOCK_STOCK_PROV_1, stockProv2: MOCK_STOCK_PROV_2 };
  }
}

export default async function HomePage() {
  const { config, stockProv1, stockProv2 } = await cargarDatos();

  const productos: ProductoConPrecio[] = [...stockProv1, ...stockProv2].map((p) => {
    const margen = p.proveedor === "prov_1" ? config.margen_prov_1 : config.margen_prov_2;
    const { precio_final_usd, precio_final_ars } = calcularPrecioFinal(p.precio_usd, p.precio_ars, margen, config.mostrar_ars);
    return {
      ...p,
      precio_final_usd,
      precio_final_ars,
      imagen: getProductImageServerFallback(p.marca, p.modelo),
    };
  });

  const totalProductos = productos.length;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Navbar — Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          {totalProductos > 0 && (
            <span className="text-neutral-500 text-xs sm:text-sm">
              {totalProductos} producto{totalProductos !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      {/* Hero — Minimalista Apple-style */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-6 sm:pt-16 sm:pb-10">
          <div className="flex flex-col items-center text-center">
            <img src="/assets/ispot_logo.jpg" alt="iSpot" className="h-40 w-auto" />
            <div className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-5">
              <Zap size={12} />
              Stock actualizado diariamente
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 pb-28 sm:pb-32">
        {totalProductos === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
            {/* Ícono */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center">
                <Smartphone size={32} className="text-neutral-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-100 border-2 border-neutral-50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-700">
              Estamos preparando el catálogo
            </h2>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm leading-relaxed">
              Los productos se cargan automáticamente cuando el proveedor envía la lista de precios del día.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Zap, label: "Precios actualizados" },
                { icon: Shield, label: "Stock garantizado" },
                { icon: Smartphone, label: "Pedido por WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white border border-neutral-100 shadow-sm rounded-full px-3.5 py-2 text-xs text-neutral-600"
                >
                  <Icon size={13} className="text-blue-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ProductGrid productos={productos} />
        )}
      </main>

      <CartSheet whatsappVendedor={config.whatsapp_vendedor} />
    </div>
  );
}
