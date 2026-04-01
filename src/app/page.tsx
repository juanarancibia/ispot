import CartSheet from "@/components/CartSheet";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import SocialButtons from "@/components/SocialButtons";
import { getConfig, getStock } from "@/lib/kv";
import { MOCK_STOCK_PROV_1, MOCK_STOCK_PROV_2 } from "@/lib/mockData";
import { calcularPrecioFinal } from "@/lib/utils";
import { getProductImageServerFallback } from "@/lib/serverUtils";
import type { ConfigNegocio, Producto, ProductoConPrecio, ProveedorId } from "@/types";

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

/** Brand color gradients — falls back to neutral for unknown brands */
const BRAND_GRADIENTS: Record<string, { base: string; hover: string; textHover: string }> = {
  canon: {
    base: "radial-gradient(circle at center, rgba(204, 0, 0, 0.15) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(204, 0, 0, 0.25) 0%, var(--theme-card-hover) 80%)",
    textHover: "#ff3333",
  },
  sony: {
    base: "radial-gradient(circle at center, rgba(234, 91, 12, 0.15) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(234, 91, 12, 0.25) 0%, var(--theme-card-hover) 80%)",
    textHover: "#ff8c42",
  },
  nikon: {
    base: "radial-gradient(circle at center, rgba(255, 230, 0, 0.15) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(255, 230, 0, 0.2) 0%, var(--theme-card-hover) 80%)",
    textHover: "#ffe600",
  },
  apple: {
    base: "radial-gradient(circle at center, rgba(142, 142, 147, 0.08) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(142, 142, 147, 0.15) 0%, var(--theme-card-hover) 80%)",
    textHover: "var(--theme-text)",
  },
  samsung: {
    base: "radial-gradient(circle at center, rgba(20, 40, 160, 0.12) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(20, 40, 160, 0.22) 0%, var(--theme-card-hover) 80%)",
    textHover: "#4285f4",
  },
  google: {
    base: "radial-gradient(circle at center, rgba(66, 133, 244, 0.12) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(66, 133, 244, 0.22) 0%, var(--theme-card-hover) 80%)",
    textHover: "#4285f4",
  },
  jbl: {
    base: "radial-gradient(circle at center, rgba(255, 102, 0, 0.12) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(255, 102, 0, 0.22) 0%, var(--theme-card-hover) 80%)",
    textHover: "#ff6600",
  },
  dji: {
    base: "radial-gradient(circle at center, rgba(160, 160, 160, 0.08) 0%, var(--theme-card) 70%)",
    hover: "radial-gradient(circle at center, rgba(160, 160, 160, 0.15) 0%, var(--theme-card-hover) 80%)",
    textHover: "#d0d0d0",
  },
};

const DEFAULT_GRADIENT = {
  base: "radial-gradient(circle at center, rgba(142, 142, 147, 0.06) 0%, var(--theme-card) 70%)",
  hover: "radial-gradient(circle at center, rgba(142, 142, 147, 0.12) 0%, var(--theme-card-hover) 80%)",
  textHover: "var(--theme-text)",
};

function getBrandGradient(brand: string) {
  return BRAND_GRADIENTS[brand.toLowerCase()] ?? DEFAULT_GRADIENT;
}

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

  // Derive unique brands
  const brands = Array.from(new Set(productos.map((p) => p.marca))).filter(Boolean);

  // Featured products
  const productosDestacados = productos
    .filter(p => !p.condicion.toLowerCase().includes("usado"))
    .slice(0, 8);

  if (productosDestacados.length < 8 && productos.length > 0) {
    const restantes = productos.filter(p => !productosDestacados.includes(p)).slice(0, 8 - productosDestacados.length);
    productosDestacados.push(...restantes);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)", color: "var(--theme-text)", transition: "background-color 0.3s ease, color 0.3s ease" }}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-th-border" style={{ transition: "border-color 0.3s ease" }}>
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 pt-12 pb-10 sm:pt-20 sm:pb-16">
          <div className="flex flex-col items-center text-center">
            <h1
              className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 max-w-3xl"
              style={{ letterSpacing: "-0.04em", lineHeight: "1.1", color: "var(--theme-text)" }}
            >
              Elige tu Compra
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--theme-muted)", lineHeight: "1.6" }}>
              Equipamiento original de fábrica. Importación de equipos premium al mejor precio del mercado.
            </p>

            <SocialButtons />
          </div>
        </div>
      </section>

      {/* Brand Cards + Featured */}
      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20">
        {/* Brand Grid */}
        {brands.length > 0 && (
          <section className="mb-16">
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            >
              {brands.map((brand, idx) => {
                const gradient = getBrandGradient(brand);
                const brandCount = productos.filter(p => p.marca === brand).length;
                return (
                  <BrandCard
                    key={brand}
                    brand={brand}
                    count={brandCount}
                    gradient={gradient}
                    index={idx}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {productosDestacados.length > 0 && (
          <section>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-8"
              style={{ color: "var(--theme-text)", letterSpacing: "-0.04em" }}
            >
              Destacados
            </h2>
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
              {productosDestacados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartSheet whatsappVendedor={config.whatsapp_vendedor} />
    </div>
  );
}
