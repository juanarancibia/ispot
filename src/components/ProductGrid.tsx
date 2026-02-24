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
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                    <input
                        id="product-search"
                        type="text"
                        placeholder="Buscar por marca o modelo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-600 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-colors"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {condiciones.map((c) => (
                        <button
                            key={c}
                            id={`filter-${c.toLowerCase().replace(/\s/g, "-")}`}
                            onClick={() => setFiltroCondicion(c)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${filtroCondicion === c
                                    ? "bg-emerald-600 border-emerald-500 text-white"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de productos */}
            {productosFiltrados.length === 0 ? (
                <div className="text-center py-20 text-zinc-600">
                    <Search size={40} className="mx-auto mb-3 opacity-40" />
                    <p>No se encontraron productos con esos filtros.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {productosFiltrados.map((p) => (
                        <ProductCard key={p.id} producto={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
