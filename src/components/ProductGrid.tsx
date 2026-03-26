"use client";

import type { ProductoConPrecio } from "@/types";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
    productos: ProductoConPrecio[];
}

export default function ProductGrid({ productos }: ProductGridProps) {
    const [busqueda, setBusqueda] = useState("");
    const [filtroCondicion, setFiltroCondicion] = useState<string>("Todos");

    const condiciones = ["Todos", ...Array.from(new Set(productos.map((p) => p.condicion)))];

    const productosFiltrados = useMemo(() => {
        return productos.filter((p) => {
            const matchBusqueda =
                busqueda === "" ||
                `${p.marca} ${p.modelo}`.toLowerCase().includes(busqueda.toLowerCase());
            const matchCondicion = filtroCondicion === "Todos" || p.condicion === filtroCondicion;
            return matchBusqueda && matchCondicion;
        });
    }, [productos, busqueda, filtroCondicion]);

    return (
        <div>
            {/* Barra de búsqueda + filtros — sticky */}
            <div className="sticky top-[49px] sm:top-[57px] z-20 bg-neutral-50/90 backdrop-blur-md -mx-5 px-5 sm:-mx-8 sm:px-8 py-3 border-b border-neutral-200/50 mb-5">
                <div className="flex flex-col gap-2 items-left">
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                        />
                        <input
                            id="product-search"
                            type="text"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 focus:border-blue-500 rounded-full text-neutral-900 text-sm placeholder:text-neutral-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Filtro pills scrollable en mobile */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                        {condiciones.map((c) => (
                            <button
                                key={c}
                                id={`filter-${c.toLowerCase().replace(/\s/g, "-")}`}
                                onClick={() => setFiltroCondicion(c)}
                                className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-150 ${filtroCondicion === c
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 active:bg-neutral-200"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contador de resultados */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-neutral-500">
                    {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Grid de productos */}
            {productosFiltrados.length === 0 ? (
                <div className="text-center py-16 text-neutral-400">
                    <Search size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No se encontraron productos</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {productosFiltrados.map((p) => (
                        <ProductCard key={p.id} producto={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
