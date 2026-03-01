"use client";

import { formatARS } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { ProductoConPrecio } from "@/types";
import { CheckCircle2, Plus, Tag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
    producto: ProductoConPrecio;
}

const CONDICION_STYLES: Record<string, string> = {
    Nuevo: "bg-neutral-100 text-neutral-600",
    Usado: "bg-amber-100 text-amber-700",
    CPO: "bg-amber-100 text-amber-700",
    "AS IS": "bg-red-100 text-red-700",
};

export default function ProductCard({ producto }: ProductCardProps) {
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(
        producto.variantes.length > 0 ? producto.variantes[0] : null
    );
    const [added, setAdded] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    const handleAdd = () => {
        addItem(producto, varianteSeleccionada);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    const condicionClass =
        CONDICION_STYLES[producto.condicion] ?? "bg-neutral-100 text-neutral-600";

    return (
        <article className="group flex flex-row sm:flex-col bg-white border border-neutral-100 hover:border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 active:scale-[0.99]">
            {/* En mobile: layout horizontal. En desktop: vertical */}
            <div className="flex flex-row sm:flex-col flex-1 p-4 sm:p-5 gap-3 sm:gap-3.5">
                {/* Info principal */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                                {producto.marca}
                            </p>
                            <h3 className="text-neutral-900 font-bold text-sm sm:text-base leading-snug mt-0.5 line-clamp-2">
                                {producto.modelo}
                            </h3>
                        </div>
                        <span
                            className={`flex-shrink-0 text-[10px] font-medium px-2.5 py-0.5 rounded-full ${condicionClass}`}
                        >
                            {producto.condicion}
                        </span>
                    </div>

                    {/* Variantes */}
                    {producto.variantes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {producto.variantes.map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVarianteSeleccionada(v)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border transition-all duration-150 ${varianteSeleccionada === v
                                        ? "bg-blue-50 border-blue-200 text-blue-700"
                                        : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100 active:bg-neutral-100"
                                        }`}
                                    aria-pressed={varianteSeleccionada === v}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Precio — solo visible en desktop dentro de este bloque */}
                    <div className="hidden sm:flex items-center gap-1.5 text-neutral-400 text-xs mt-3 pt-3 border-t border-neutral-100">
                        <Tag size={11} />
                        <span>USD {producto.precio_usd.toLocaleString("es-AR")}</span>
                    </div>
                    <p className="hidden sm:block text-blue-600 font-bold text-lg mt-0.5">
                        {formatARS(producto.precio_final_ars)}
                    </p>
                </div>

                {/* Columna derecha en mobile: precio + botón */}
                <div className="flex flex-col items-end justify-between sm:hidden gap-2">
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-neutral-400 text-[10px]">
                            <Tag size={9} />
                            <span>USD {producto.precio_usd.toLocaleString("es-AR")}</span>
                        </div>
                        <p className="text-blue-600 font-bold text-base">
                            {formatARS(producto.precio_final_ars)}
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        aria-label={`Agregar ${producto.modelo} al carrito`}
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${added
                            ? "bg-blue-700 scale-90"
                            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-700 shadow-sm"
                            }`}
                    >
                        {added ? (
                            <CheckCircle2 size={16} className="text-white" />
                        ) : (
                            <Plus size={16} className="text-white" />
                        )}
                    </button>
                </div>

                {/* Botón agregar — solo desktop */}
                <div className="hidden sm:flex items-center gap-2 mt-1">
                    <button
                        id={`add-to-cart-${producto.id}`}
                        onClick={handleAdd}
                        aria-label={`Agregar ${producto.modelo} al carrito`}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-6 py-2 rounded-full transition-all duration-200 ${added
                            ? "bg-blue-700 text-white scale-[0.98]"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                            }`}
                    >
                        {added ? (
                            <>
                                <CheckCircle2 size={15} />
                                <span>Agregado</span>
                            </>
                        ) : (
                            <>
                                <Plus size={15} />
                                <span>Agregar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}
