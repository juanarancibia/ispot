import { getStock } from "@/lib/kv";
import { MOCK_STOCK_PROV_1, MOCK_STOCK_PROV_2 } from "@/lib/mockData";
import HamburgerMenu from "./HamburgerMenu";
import type { ProveedorId } from "@/types";
import HeaderClient from "./HeaderClient";

const PROVIDERS: ProveedorId[] = ["prov_1", "prov_2", "prov_3", "prov_4", "prov_5"];

async function getCategorias(): Promise<string[]> {
    try {
        const stocks = await Promise.all(
            PROVIDERS.map(prov => getStock(prov))
        );
        const productos = stocks.flat();
        const categoriasRaw = Array.from(new Set(productos.map((p) => p.categoria)));
        return categoriasRaw.filter(Boolean) as string[];
    } catch {
        const mockProductos = [...MOCK_STOCK_PROV_1, ...MOCK_STOCK_PROV_2];
        const categoriasRaw = Array.from(new Set(mockProductos.map((p) => p.categoria)));
        return categoriasRaw.filter(Boolean) as string[];
    }
}

export default async function Header() {
    const categorias = await getCategorias();

    return (
        <header
            className="sticky top-0 z-50 border-b border-th-border"
            style={{
                background: "var(--theme-header)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "background-color 0.3s ease",
            }}
        >
            <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 gap-3">
                {/* Left: Hamburger */}
                <HamburgerMenu categorias={categorias} />

                {/* Center: Logo */}
                <HeaderClient />

                {/* Right: Theme Toggle + Cart (rendered by HeaderClient) */}
            </div>
        </header>
    );
}
