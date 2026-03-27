import CartSheet from "@/components/CartSheet";
import ProductCard from "@/components/ProductCard";
import { getConfig, getStock } from "@/lib/kv";
import { MOCK_STOCK_PROV_1, MOCK_STOCK_PROV_2 } from "@/lib/mockData";
import { calcularPrecioFinal } from "@/lib/utils";
import { getProductImageServerFallback } from "@/lib/serverUtils";
import type { ConfigNegocio, Producto, ProductoConPrecio, ProveedorId } from "@/types";
import { Shield, Smartphone, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

const DEFAULT_CONFIG: ConfigNegocio = {
  margen_prov_1: 1.15,
  margen_prov_2: 1.2,
  margen_prov_3: 1.15,
  margen_prov_4: 1.15,
  margen_prov_5: 1.15,
  whatsapp_vendedor: "",
  mostrar_ars: true,
};

const PROVIDERS: ProveedorId[] = ["prov_1", "prov_2", "prov_3", "prov_4", "prov_5"];

async function cargarDatos(): Promise<{
  config: ConfigNegocio;
  stockTodos: Producto[];
}> {
  try {
    const [config, ...stocks] = await Promise.all([
      getConfig(),
      ...PROVIDERS.map(prov => getStock(prov)),
    ]);
    return { config, stockTodos: stocks.flat() };
  } catch {
    console.warn("[HomePage] KV no disponible, usando datos mock.");
    return { 
      config: DEFAULT_CONFIG, 
      stockTodos: [...MOCK_STOCK_PROV_1, ...MOCK_STOCK_PROV_2] 
    };
  }
}

export default async function HomePage() {
  const { config, stockTodos } = await cargarDatos();

  const productos: ProductoConPrecio[] = stockTodos.map((p) => {
    let margen = 1.15;
    if (p.proveedor === "prov_1") margen = config.margen_prov_1;
    else if (p.proveedor === "prov_2") margen = config.margen_prov_2;
    else if (p.proveedor === "prov_3") margen = config.margen_prov_3;
    else if (p.proveedor === "prov_4") margen = config.margen_prov_4;
    else if (p.proveedor === "prov_5") margen = config.margen_prov_5;

    const { precio_final_usd, precio_final_ars } = calcularPrecioFinal(p.precio_usd, p.precio_ars, margen, config.mostrar_ars, p.precio_manual_usd, p.precio_manual_ars);
    return {
      ...p,
      precio_final_usd,
      precio_final_ars,
      imagen: getProductImageServerFallback(p.marca, p.modelo),
    };
  });

  const totalProductos = productos.length;

  // Seleccionamos algunos productos como "Destacados"
  // Aquí podemos simplemente limitar a los primeros 8 productos nuevos.
  const productosDestacados = productos
    .filter(p => !p.condicion.toLowerCase().includes("usado"))
    .slice(0, 8);

  // Si no hay 8 nuevos, rellenamos con lo que haya
  if (productosDestacados.length < 8 && productos.length > 0) {
      const restantes = productos.filter(p => !productosDestacados.includes(p)).slice(0, 8 - productosDestacados.length);
      productosDestacados.push(...restantes);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero — Minimalista Apple-style */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-200/50">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-14 sm:pt-20 sm:pb-20">
          <div className="flex flex-col items-center text-center">
            
            <div className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50/80 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-6 border border-blue-100/50">
              <Zap size={12} className="text-blue-500 fill-blue-500" />
              Catálogo Actualizado
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 mb-5 max-w-3xl leading-[1.1]">
              Descubrí tecnología de primer nivel.
            </h1>
            
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Navegá por el menú para ver nuestras distintas categorías de productos. Importados, con stock garantizado y al mejor precio del mercado.
            </p>
            
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-28 sm:pb-32">
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
                  className="flex items-center gap-2 bg-white border border-neutral-100 shadow-sm rounded-full px-3.5 py-2 text-xs text-neutral-600 font-medium"
                >
                  <Icon size={13} className="text-blue-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Destacados</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {productosDestacados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <CartSheet whatsappVendedor={config.whatsapp_vendedor} />
    </div>
  );
}
