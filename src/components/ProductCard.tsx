"use client";

import { formatARS } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { ProductoConPrecio } from "@/types";
import { CheckCircle2, ShoppingCart, Tag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
    producto: ProductoConPrecio;
}

const CONDICION_COLORS: Record<string, string> = {
    Nuevo: "bg-emerald-500/15 text-emerald-400",
    Usado: "bg-amber-500/15 text-amber-400",
    CPO: "bg-blue-500/15 text-blue-400",
    "AS IS": "bg-red-500/15 text-red-400",
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
        setTimeout(() => setAdded(false), 1500);
    };

    const condicionClass =
        CONDICION_COLORS[producto.condicion] ?? "bg-zinc-500/15 text-zinc-400";

    return (
        <article className="group relative flex flex-col bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
            {/* Header de color con la marca */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600 group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-300" />

            <div className="flex flex-col flex-1 p-5 gap-4">
                {/* Marca + Condición */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                            {producto.marca}
                        </p>
                        <h3 className="text-white font-bold text-base leading-tight mt-0.5">
                            {producto.modelo}
                        </h3>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${condicionClass}`}>
                        {producto.condicion}
                    </span>
                </div>

                {/* Selector de Variantes */}
                {producto.variantes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {producto.variantes.map((v) => (
                            <button
                                key={v}
                                onClick={() => setVarianteSeleccionada(v)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${varianteSeleccionada === v
                                        ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/40"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                                    }`}
                                aria-pressed={varianteSeleccionada === v}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                )}

                {/* Footer: precio + botón */}
                <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                    <div>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs">
                            <Tag size={11} />
                            <span>USD {producto.precio_usd.toLocaleString("es-AR")}</span>
                        </div>
                        <p className="text-emerald-400 font-bold text-lg">
                            {formatARS(producto.precio_final_ars)}
                        </p>
                    </div>
                    <button
                        id={`add-to-cart-${producto.id}`}
                        onClick={handleAdd}
                        aria-label={`Agregar ${producto.modelo} al carrito`}
                        className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${added
                                ? "bg-emerald-700 text-white scale-95"
                                : "bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white border border-zinc-700 hover:border-emerald-500"
                            }`}
                    >
                        {added ? (
                            <>
                                <CheckCircle2 size={16} />
                                <span>Agregado</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={16} />
                                <span>Agregar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}
