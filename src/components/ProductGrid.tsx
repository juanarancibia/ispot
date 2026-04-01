"use client";

import type { ProductoConPrecio } from "@/types";
import { Search, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
    productos: ProductoConPrecio[];
}

export default function ProductGrid({ productos }: ProductGridProps) {
    const [busqueda, setBusqueda] = useState("");
    const [filtroMarca, setFiltroMarca] = useState<string>("Todas");
    const [filtroCondicion, setFiltroCondicion] = useState<string>("Todos");
    const [filtroAlmacenamiento, setFiltroAlmacenamiento] = useState<string>("Todos");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const condicionesRaw = Array.from(new Set(productos.map((p) => p.condicion)));
    const condiciones = ["Todos", ...condicionesRaw.filter(Boolean)] as string[];

    const almacenamientosRaw = Array.from(new Set(productos.map((p) => p.almacenamiento)));
    const almacenamientos = ["Todos", ...almacenamientosRaw.filter(Boolean)] as string[];
    const showAlmacenamientoFilter = almacenamientos.length > 1;

    const marcasRaw = Array.from(new Set(productos.map((p) => p.marca)));
    const marcas = ["Todas", ...marcasRaw.filter(Boolean)] as string[];
    const showMarcaFilter = marcasRaw.length > 1;

    const productosFiltrados = useMemo(() => {
        return productos.filter((p) => {
            const matchBusqueda =
                busqueda === "" ||
                `${p.marca} ${p.modelo}`.toLowerCase().includes(busqueda.toLowerCase());
            const matchMarca = filtroMarca === "Todas" || p.marca === filtroMarca;
            const matchCondicion = filtroCondicion === "Todos" || p.condicion === filtroCondicion;
            const matchAlmacenamiento = filtroAlmacenamiento === "Todos" || p.almacenamiento === filtroAlmacenamiento;
            return matchBusqueda && matchMarca && matchCondicion && matchAlmacenamiento;
        });
    }, [productos, busqueda, filtroMarca, filtroCondicion, filtroAlmacenamiento]);

    return (
        <div>
            {/* Search + Filters — sticky */}
            <div
                className="sticky top-[49px] sm:top-[57px] z-20 -mx-5 px-5 sm:-mx-8 sm:px-8 py-3 border-b mb-5"
                style={{
                    background: "var(--theme-bg)",
                    borderColor: "var(--theme-border)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    opacity: 0.97,
                }}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 mb-2 sm:mb-0">
                        <div className="relative flex-1">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: "var(--theme-muted)" }}
                            />
                            <input
                                id="product-search"
                                type="text"
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none transition-all"
                                style={{
                                    background: "var(--theme-input)",
                                    border: "1px solid var(--theme-input-border)",
                                    color: "var(--theme-text)",
                                    fontFamily: "inherit",
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "var(--theme-accent)";
                                    e.currentTarget.style.boxShadow = `0 0 0 3px var(--theme-input-focus)`;
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "var(--theme-input-border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        {/* Mobile Filter Toggle Button */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[var(--theme-input)] text-[var(--theme-text)] border border-[var(--theme-input-border)] transition-all active:scale-95"
                            aria-label="Toggle Filters"
                        >
                            {showMobileFilters ? <X size={18} /> : <Filter size={18} />}
                        </button>
                    </div>

                    {/* Filter Pills Wrapper (Hidden on mobile unless toggled) */}
                    <div className={`sm:flex flex-col gap-2 transition-all ${showMobileFilters ? "flex" : "hidden"}`}>

                    {/* Marca pills */}
                    {showMarcaFilter && (
                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                            <span className="text-xs font-medium self-center mr-1" style={{ color: "var(--theme-muted)" }}>
                                Marca:
                            </span>
                            {marcas.map((m) => (
                                <button
                                    key={m}
                                    id={`filter-brand-${m.toLowerCase().replace(/\s/g, "-")}`}
                                    onClick={() => setFiltroMarca(m)}
                                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                                    style={
                                        filtroMarca === m
                                            ? {
                                                background: "var(--theme-text)",
                                                color: "var(--theme-bg)",
                                                border: "1px solid transparent",
                                            }
                                            : {
                                                background: "transparent",
                                                color: "var(--theme-text)",
                                                border: "1px solid var(--theme-card-border)",
                                            }
                                    }
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Condition pills */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        <span className="text-xs font-medium self-center mr-1" style={{ color: "var(--theme-muted)" }}>
                            Condición:
                        </span>
                        {condiciones.map((c) => (
                            <button
                                key={c}
                                id={`filter-${c.toLowerCase().replace(/\s/g, "-")}`}
                                onClick={() => setFiltroCondicion(c)}
                                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                                style={
                                    filtroCondicion === c
                                        ? {
                                            background: "var(--theme-text)",
                                            color: "var(--theme-bg)",
                                            border: "1px solid transparent",
                                        }
                                        : {
                                            background: "transparent",
                                            color: "var(--theme-text)",
                                            border: "1px solid var(--theme-card-border)",
                                        }
                                }
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Storage pills */}
                    {showAlmacenamientoFilter && (
                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                            <span className="text-xs font-medium self-center mr-1" style={{ color: "var(--theme-muted)" }}>
                                Capacidad:
                            </span>
                            {almacenamientos.map((a) => (
                                <button
                                    key={a}
                                    id={`filter-storage-${a.toLowerCase().replace(/\s/g, "-")}`}
                                    onClick={() => setFiltroAlmacenamiento(a)}
                                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer"
                                    style={
                                        filtroAlmacenamiento === a
                                            ? {
                                                background: "var(--theme-text)",
                                                color: "var(--theme-bg)",
                                                border: "1px solid transparent",
                                            }
                                            : {
                                                background: "transparent",
                                                color: "var(--theme-text)",
                                                border: "1px solid var(--theme-card-border)",
                                            }
                                    }
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs" style={{ color: "var(--theme-muted)" }}>
                    {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Product grid */}
            {productosFiltrados.length === 0 ? (
                <div className="text-center py-16" style={{ color: "var(--theme-muted)" }}>
                    <Search size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No se encontraron productos</p>
                </div>
            ) : (
                <div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
                >
                    {productosFiltrados.map((p, idx) => (
                        <div key={p.id} className={`animate-fade-in-up stagger-${Math.min((idx % 6) + 1, 6)}`}>
                            <ProductCard producto={p} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
