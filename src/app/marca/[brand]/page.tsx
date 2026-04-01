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
    console.warn("[MarcaPage] KV no disponible, usando datos mock.");
    return {
      config: DEFAULT_CONFIG,
      stockTodos: [...MOCK_STOCK_PROV_1, ...MOCK_STOCK_PROV_2]
    };
  }
}

/** Brand color gradients — same as homepage */
const BRAND_GRADIENTS: Record<string, { base: string; hover: string; textHover: string }> = {
  canon: {
    base: "radial-gradient(circle at center, rgba(204, 0, 0, 0.15) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(204, 0, 0, 0.25) 0%, var(--theme-bg) 80%)",
    textHover: "#ff3333",
  },
  sony: {
    base: "radial-gradient(circle at center, rgba(234, 91, 12, 0.15) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(234, 91, 12, 0.25) 0%, var(--theme-bg) 80%)",
    textHover: "#ff8c42",
  },
  nikon: {
    base: "radial-gradient(circle at center, rgba(255, 230, 0, 0.15) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(255, 230, 0, 0.2) 0%, var(--theme-bg) 80%)",
    textHover: "#ffe600",
  },
  apple: {
    base: "radial-gradient(circle at center, rgba(142, 142, 147, 0.08) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(142, 142, 147, 0.15) 0%, var(--theme-bg) 80%)",
    textHover: "var(--theme-text)",
  },
  samsung: {
    base: "radial-gradient(circle at center, rgba(20, 40, 160, 0.12) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(20, 40, 160, 0.22) 0%, var(--theme-bg) 80%)",
    textHover: "#4285f4",
  },
  google: {
    base: "radial-gradient(circle at center, rgba(66, 133, 244, 0.12) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(66, 133, 244, 0.22) 0%, var(--theme-bg) 80%)",
    textHover: "#4285f4",
  },
  jbl: {
    base: "radial-gradient(circle at center, rgba(255, 102, 0, 0.12) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(255, 102, 0, 0.22) 0%, var(--theme-bg) 80%)",
    textHover: "#ff6600",
  },
  dji: {
    base: "radial-gradient(circle at center, rgba(160, 160, 160, 0.08) 0%, var(--theme-bg) 70%)",
    hover: "radial-gradient(circle at center, rgba(160, 160, 160, 0.15) 0%, var(--theme-bg) 80%)",
    textHover: "#d0d0d0",
  },
};

const DEFAULT_GRADIENT = {
  base: "radial-gradient(circle at center, rgba(142, 142, 147, 0.06) 0%, var(--theme-bg) 70%)",
  hover: "radial-gradient(circle at center, rgba(142, 142, 147, 0.12) 0%, var(--theme-bg) 80%)",
  textHover: "var(--theme-text)",
};

function getBrandGradient(brand: string) {
  return BRAND_GRADIENTS[brand.toLowerCase()] ?? DEFAULT_GRADIENT;
}

export default async function MarcaPage(props: { params: Promise<{ brand: string }> }) {
  const params = await props.params;
  const { config, stockTodos } = await cargarDatos();
  const brandDecoded = decodeURIComponent(params.brand);

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

  const productosDeMarca = todosLosProductos.filter(
    p => p.marca.toLowerCase() === brandDecoded.toLowerCase()
  );

  if (productosDeMarca.length === 0 && todosLosProductos.length > 0) {
    notFound();
  }

  const marcaNombre = productosDeMarca.length > 0 ? productosDeMarca[0].marca : brandDecoded;
  const gradient = getBrandGradient(marcaNombre);

  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)", color: "var(--theme-text)", transition: "background-color 0.3s ease, color 0.3s ease" }}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-th-border" style={{ background: gradient.base }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:py-20 text-center animate-fade-in-up">
           {/* Breadcrumb inside hero for unified look */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm mb-6 font-medium" style={{ color: "var(--theme-muted)" }}>
              <Link href="/" className="hover:text-th-text transition-colors flex items-center gap-1.5">
                <Home size={14} />
                Inicio
              </Link>
              <ChevronRight size={14} style={{ color: "var(--theme-border-strong)" }} />
              <span className="font-semibold" style={{ color: "var(--theme-text)" }}>{marcaNombre}</span>
            </nav>

            <h1
              className="text-4xl sm:text-6xl font-bold tracking-tight mb-4"
              style={{ color: "var(--theme-text)", letterSpacing: "-0.04em" }}
            >
              {marcaNombre}
            </h1>
            <p className="text-sm sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--theme-muted)" }}>
              {productosDeMarca.length} {productosDeMarca.length === 1 ? "producto" : "productos"} disponibles en stock.
            </p>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-8 pb-28 sm:pb-32">
        {productosDeMarca.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--theme-muted)" }}>
            <p className="text-sm">No se encontraron productos para esta marca</p>
          </div>
        ) : (
          <ProductGrid productos={productosDeMarca} />
        )}
      </main>

      <CartSheet whatsappVendedor={config.whatsapp_vendedor} />
    </div>
  );
}
