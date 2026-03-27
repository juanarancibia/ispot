import { getStock } from "@/lib/kv";
import { MOCK_STOCK_PROV_1, MOCK_STOCK_PROV_2 } from "@/lib/mockData";
import HamburgerMenu from "./HamburgerMenu";
import type { ProveedorId } from "@/types";

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
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-200/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
                <HamburgerMenu categorias={categorias} />
                
                <div className="flex-1 flex justify-center">
                    <img src="/assets/ispot_logo.jpg" alt="iSpot Logo" className="h-7 sm:h-8 w-auto mix-blend-multiply" />
                </div>
                
                <div className="w-8">
                    {/* Placeholder for symmetry */}
                </div>
            </div>
        </header>
    );
}
