import CartSheet from "@/components/CartSheet";
import ProductGrid from "@/components/ProductGrid";
import { getConfig, getStock } from "@/lib/kv";
import { MOCK_STOCK_PROV_1, MOCK_STOCK_PROV_2 } from "@/lib/mockData";
import { calcularPrecioFinal } from "@/lib/utils";
import { getProductImageServerFallback } from "@/lib/serverUtils";
import type { ConfigNegocio, Producto, ProductoConPrecio, ProveedorId } from "@/types";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    console.warn("[CategoriaPage] KV no disponible, usando datos mock.");
    return { 
      config: DEFAULT_CONFIG, 
      stockTodos: [...MOCK_STOCK_PROV_1, ...MOCK_STOCK_PROV_2] 
    };
  }
}

export default async function CategoriaPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { config, stockTodos } = await cargarDatos();
  const slugDecoded = decodeURIComponent(params.slug);
  
  const todosLosProductos: ProductoConPrecio[] = stockTodos.map((p) => {
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

  const productosDeCategoria = todosLosProductos.filter(
      p => encodeURIComponent(p.categoria) === params.slug || p.categoria === slugDecoded || p.categoria.toLowerCase() === slugDecoded.toLowerCase()
  );

  if (productosDeCategoria.length === 0 && todosLosProductos.length > 0) {
      notFound();
  }

  const categoriaNombre = productosDeCategoria.length > 0 ? productosDeCategoria[0].categoria : slugDecoded;

  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)", color: "var(--theme-text)", transition: "background-color 0.3s ease, color 0.3s ease" }}>
      
      {/* Category Hero */}
      <section className="relative overflow-hidden border-b border-th-border" style={{ background: "radial-gradient(circle at center, var(--theme-card-hover) 0%, var(--theme-bg) 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-10 sm:py-16 text-center animate-fade-in-up">
            {/* Breadcrumb inside hero */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm mb-6 font-medium" style={{ color: "var(--theme-muted)" }}>
              <Link href="/" className="hover:text-th-text transition-colors flex items-center gap-1.5">
                <Home size={14} />
                Inicio
              </Link>
              <ChevronRight size={14} style={{ color: "var(--theme-border-strong)" }} />
              <span className="font-semibold" style={{ color: "var(--theme-text)" }}>{categoriaNombre}</span>
            </nav>

            <h1
              className="text-3xl sm:text-5xl font-bold tracking-tight mb-3"
              style={{ color: "var(--theme-text)", letterSpacing: "-0.04em" }}
            >
              {categoriaNombre}
            </h1>
            <p className="text-sm sm:text-base opacity-70" style={{ color: "var(--theme-muted)" }}>
              {productosDeCategoria.length} {productosDeCategoria.length === 1 ? "artículo" : "artículos"} en esta categoría.
            </p>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-8 pb-28 sm:pb-32">
        {productosDeCategoria.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--theme-muted)" }}>
                <p className="text-sm">No se encontraron productos para esta categoría</p>
            </div>
        ) : (
            <ProductGrid productos={productosDeCategoria} />
        )}
      </main>

      <CartSheet whatsappVendedor={config.whatsapp_vendedor} />
    </div>
  );
}
