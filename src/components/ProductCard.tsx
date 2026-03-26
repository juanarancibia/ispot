"use client";

import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { ProductoConPrecio } from "@/types";
import { CheckCircle2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Tomar la imagen resuelta en el servidor
    const initialImgSrc = producto.imagen || "/assets/ispot_logo.jpg";
    const [imgSrc, setImgSrc] = useState(initialImgSrc);
    const isFallback = imgSrc === "/assets/ispot_logo.jpg";

    useEffect(() => {
        setImgSrc(initialImgSrc);
    }, [initialImgSrc]);

    // Prevenir scroll cuando el modal está abierto
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    const addItem = useCartStore((s) => s.addItem);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir abrir/cerrar modal
        addItem(producto, varianteSeleccionada);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setIsModalOpen(false); // Opcional: Cerrar modal después de agregar, o no
        }, 1200);
    };

    const condicionClass =
        CONDICION_STYLES[producto.condicion] ?? "bg-neutral-100 text-neutral-600";

    return (
        <>
            <article 
                onClick={() => setIsModalOpen(true)}
                className="group flex flex-row sm:flex-col bg-white border border-neutral-100 hover:border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 active:scale-[0.99] h-full cursor-pointer"
            >
                {/* En mobile: layout horizontal. En desktop: vertical */}
                <div className="flex flex-row sm:flex-col flex-1 p-3 sm:p-5 gap-3 sm:gap-4">
                    {/* Imagen del producto */}
                    <div className="relative w-28 h-28 sm:w-full sm:h-48 flex-shrink-0 flex items-center justify-center bg-neutral-50/50 rounded-xl overflow-hidden p-2 group-hover:bg-neutral-50 transition-colors">
                        <img
                            src={imgSrc}
                            alt={`${producto.marca} ${producto.modelo}`}
                            className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${isFallback ? "opacity-20 grayscale scale-75" : "mix-blend-multiply"}`}
                            onError={() => {
                                if (!isFallback) setImgSrc("/assets/ispot_logo.jpg");
                            }}
                        />
                    </div>

                    {/* Info principal reducida */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                        <div>
                            <div className="flex items-start gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                                        {producto.marca}
                                    </p>
                                    <h3 className="text-neutral-900 font-bold text-sm sm:text-base leading-snug mt-0.5 line-clamp-2">
                                        {producto.modelo}
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-1">
                                <span className={`inline-block flex-shrink-0 text-[10px] font-medium px-2.5 py-0.5 rounded-full ${condicionClass}`}>
                                    {producto.condicion}
                                </span>
                            </div>
                        </div>

                        {/* Precios unificados */}
                        <div className="mt-auto pt-3 border-t border-neutral-100">
                            {producto.precio_final_ars ? (
                                <>
                                    <p className="text-blue-600 font-bold text-base sm:text-lg leading-tight">
                                        {formatMoney(producto.precio_final_ars, "ARS")}
                                    </p>
                                    <p className="text-neutral-400 text-xs mt-0.5">
                                        {formatMoney(producto.precio_final_usd, "USD")}
                                    </p>
                                </>
                            ) : (
                                <p className="text-blue-600 font-bold text-base sm:text-lg mt-0.5">
                                    {formatMoney(producto.precio_final_usd, "USD")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Modal de Detalle */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsModalOpen(false)} 
                    />
                    
                    <div className="relative w-full max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-100/80 hover:bg-neutral-200 text-neutral-600 rounded-full transition-colors z-20 backdrop-blur-md"
                        >
                            <X size={18} />
                        </button>
                        
                        <div className="overflow-y-auto w-full pb-28 sm:pb-6">
                            {/* Imagen Grande */}
                            <div className="w-full aspect-square sm:h-72 sm:aspect-auto flex items-center justify-center bg-neutral-50/50 p-8 sm:p-10 mb-2">
                                <img
                                    src={imgSrc}
                                    alt={`${producto.marca} ${producto.modelo}`}
                                    className={`w-full h-full object-contain ${isFallback ? "opacity-20 grayscale scale-75" : "mix-blend-multiply"}`}
                                />
                            </div>
                            
                            <div className="px-5 sm:px-8">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">
                                            {producto.marca}
                                        </p>
                                        <h2 className="text-2xl font-bold text-neutral-900 leading-tight">
                                            {producto.modelo}
                                        </h2>
                                    </div>
                                    <span className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full ${condicionClass}`}>
                                        {producto.condicion}
                                    </span>
                                </div>

                                <div className="mt-4 mb-6">
                                    {producto.precio_final_ars ? (
                                        <div className="flex items-end gap-3">
                                            <p className="text-3xl font-bold text-blue-600">
                                                {formatMoney(producto.precio_final_ars, "ARS")}
                                            </p>
                                            <p className="text-sm font-medium text-neutral-400 mb-1.5">
                                                {formatMoney(producto.precio_final_usd, "USD")}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-bold text-blue-600">
                                            {formatMoney(producto.precio_final_usd, "USD")}
                                        </p>
                                    )}
                                </div>

                                {/* Variantes dentro del Modal */}
                                {producto.variantes.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-neutral-900 mb-3">Capacidad / Variante</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {producto.variantes.map((v) => (
                                                <button
                                                    key={v}
                                                    onClick={() => setVarianteSeleccionada(v)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                                                        varianteSeleccionada === v
                                                            ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                                                    }`}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Fijo con Botón (Mobile: pegado abajo, Desktop: pegado adentro) */}
                        <div className="fixed sm:absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-white/90 backdrop-blur-md border-t border-neutral-100 z-20">
                            <button
                                onClick={handleAdd}
                                className={`w-full h-14 flex items-center justify-center gap-2 text-base font-semibold rounded-xl transition-all duration-200 ${
                                    added
                                        ? "bg-blue-700 text-white scale-[0.98]"
                                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/20"
                                }`}
                            >
                                {added ? (
                                    <>
                                        <CheckCircle2 size={20} />
                                        <span>Agregado al carrito</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        <span>Agregar al carrito</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

