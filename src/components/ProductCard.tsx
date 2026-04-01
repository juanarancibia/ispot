"use client";

import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { ProductoConPrecio } from "@/types";
import { CheckCircle2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductCardProps {
    producto: ProductoConPrecio;
}

function getCondicionStyle(condicion: string): { bg: string; text: string } {
    const key = condicion.toLowerCase();
    if (key === "nuevo") return { bg: "var(--theme-badge-new)", text: "var(--theme-badge-new-text)" };
    if (key === "usado" || key === "cpo") return { bg: "var(--theme-badge-used)", text: "var(--theme-badge-used-text)" };
    if (key === "as is") return { bg: "var(--theme-badge-danger)", text: "var(--theme-badge-danger-text)" };
    return { bg: "var(--theme-badge-new)", text: "var(--theme-badge-new-text)" };
}

export default function ProductCard({ producto }: ProductCardProps) {
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(
        producto.variantes.length > 0 ? producto.variantes[0] : null
    );
    const [added, setAdded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialImgSrc = producto.imagen || "/assets/ispot_logo.jpg";
    const [imgSrc, setImgSrc] = useState(initialImgSrc);
    const isFallback = imgSrc === "/assets/ispot_logo.jpg";

    useEffect(() => {
        setImgSrc(initialImgSrc);
    }, [initialImgSrc]);

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
        e.stopPropagation();
        addItem(producto, varianteSeleccionada);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setIsModalOpen(false);
        }, 1200);
    };

    const condStyle = getCondicionStyle(producto.condicion);

    return (
        <>
            {/* Product Card */}
            <article
                onClick={() => setIsModalOpen(true)}
                className="group flex flex-row sm:flex-col h-full cursor-pointer overflow-hidden"
                style={{
                    background: "var(--theme-card)",
                    border: "1px solid var(--theme-card-border)",
                    borderRadius: "var(--card-radius)",
                    transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.background = "var(--theme-card-hover)";
                    e.currentTarget.style.boxShadow = `0 10px 30px var(--theme-shadow-hover)`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "var(--theme-card)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                <div className="flex flex-row sm:flex-col flex-1 p-3 sm:p-5 gap-3 sm:gap-4">
                    {/* Image */}
                    <div
                        className="relative w-28 h-28 sm:w-full sm:h-48 flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden p-2"
                        style={{ background: "transparent" }}
                    >
                        <img
                            src={imgSrc}
                            alt={`${producto.marca} ${producto.modelo}`}
                            className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${isFallback ? "opacity-20 grayscale scale-75" : ""}`}
                            onError={() => {
                                if (!isFallback) setImgSrc("/assets/ispot_logo.jpg");
                            }}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                        <div>
                            <div className="flex items-start gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold"
                                        style={{ color: "var(--theme-muted)" }}
                                    >
                                        {producto.marca}
                                    </p>
                                    <h3
                                        className="font-bold text-sm sm:text-base leading-snug mt-0.5 line-clamp-2"
                                        style={{ color: "var(--theme-text)" }}
                                    >
                                        {producto.modelo}
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-1">
                                <span
                                    className="inline-block flex-shrink-0 text-[10px] font-medium px-2.5 py-0.5 rounded-full"
                                    style={{ background: condStyle.bg, color: condStyle.text }}
                                >
                                    {producto.condicion}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mt-auto pt-3" style={{ borderTop: "1px solid var(--theme-card-border)" }}>
                            {producto.precio_final_ars ? (
                                <>
                                    <p className="font-bold text-base sm:text-lg leading-tight" style={{ color: "var(--theme-accent)" }}>
                                        {formatMoney(producto.precio_final_ars, "ARS")}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--theme-muted)" }}>
                                        {formatMoney(producto.precio_final_usd, "USD")}
                                    </p>
                                </>
                            ) : (
                                <p className="font-bold text-base sm:text-lg mt-0.5" style={{ color: "var(--theme-accent)" }}>
                                    {formatMoney(producto.precio_final_usd, "USD")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div
                        className="fixed inset-0 transition-opacity"
                        style={{
                            background: "var(--theme-overlay)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                        }}
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div
                        className="relative w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden z-10 animate-scale-in max-h-[90vh] flex flex-col"
                        style={{
                            background: "var(--theme-modal)",
                            border: "1px solid var(--theme-card-border)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20 cursor-pointer"
                            style={{
                                background: "var(--theme-input)",
                                color: "var(--theme-muted)",
                            }}
                        >
                            <X size={18} />
                        </button>

                        <div className="overflow-y-auto w-full pb-28 sm:pb-6">
                            {/* Image */}
                            <div className="w-full aspect-square sm:h-72 sm:aspect-auto flex items-center justify-center p-8 sm:p-10 mb-2">
                                <img
                                    src={imgSrc}
                                    alt={`${producto.marca} ${producto.modelo}`}
                                    className={`w-full h-full object-contain ${isFallback ? "opacity-20 grayscale scale-75" : ""}`}
                                />
                            </div>

                            <div className="px-5 sm:px-8">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                        <p
                                            className="text-xs uppercase tracking-wider font-semibold mb-1"
                                            style={{ color: "var(--theme-muted)" }}
                                        >
                                            {producto.marca}
                                        </p>
                                        <h2
                                            className="text-2xl font-bold leading-tight"
                                            style={{ color: "var(--theme-text)", letterSpacing: "-0.02em" }}
                                        >
                                            {producto.modelo}
                                        </h2>
                                    </div>
                                    <span
                                        className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full"
                                        style={{ background: condStyle.bg, color: condStyle.text }}
                                    >
                                        {producto.condicion}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="mt-4 mb-6">
                                    {producto.precio_final_ars ? (
                                        <div className="flex items-end gap-3">
                                            <p className="text-3xl font-bold" style={{ color: "var(--theme-accent)" }}>
                                                {formatMoney(producto.precio_final_ars, "ARS")}
                                            </p>
                                            <p className="text-sm font-medium mb-1.5" style={{ color: "var(--theme-muted)" }}>
                                                {formatMoney(producto.precio_final_usd, "USD")}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-bold" style={{ color: "var(--theme-accent)" }}>
                                            {formatMoney(producto.precio_final_usd, "USD")}
                                        </p>
                                    )}
                                </div>

                                { (producto.almacenamiento || producto.variantes.length > 0) && (
                                    <div className="mb-6">
                                        <h4
                                            className="text-xs font-medium uppercase tracking-wider mb-3"
                                            style={{ color: "var(--theme-muted)", letterSpacing: "0.05em" }}
                                        >
                                            {producto.almacenamiento && !producto.variantes.length ? "Capacidad" : "Variante / Color"}
                                        </h4>
                                        
                                        {producto.almacenamiento && !producto.variantes.length && (
                                            <div className="px-4 py-2.5 rounded-full text-sm font-semibold border inline-block"
                                                style={{
                                                    background: "var(--theme-text)",
                                                    color: "var(--theme-bg)",
                                                    borderColor: "var(--theme-text)",
                                                }}
                                            >
                                                {producto.almacenamiento}
                                            </div>
                                        )}

                                        {producto.variantes.length > 0 && (
                                            <div className="flex gap-2 flex-wrap">
                                                {producto.variantes.map((v) => (
                                                    <button
                                                        key={v}
                                                        onClick={() => setVarianteSeleccionada(v)}
                                                        className="px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer"
                                                        style={
                                                            varianteSeleccionada === v
                                                                ? {
                                                                    background: "var(--theme-text)",
                                                                    color: "var(--theme-bg)",
                                                                    borderColor: "var(--theme-text)",
                                                                    fontWeight: 600,
                                                                }
                                                                : {
                                                                    background: "transparent",
                                                                    color: "var(--theme-text)",
                                                                    borderColor: "var(--theme-card-border)",
                                                                }
                                                        }
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div
                            className="fixed sm:absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20"
                            style={{
                                background: "var(--theme-modal)",
                                borderTop: "1px solid var(--theme-border)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                            }}
                        >
                            <button
                                onClick={handleAdd}
                                className="w-full h-14 flex items-center justify-center gap-2 text-base font-semibold rounded-full transition-all duration-200 cursor-pointer"
                                style={{
                                    background: added ? "var(--theme-accent-hover)" : "var(--theme-accent)",
                                    color: "white",
                                    transform: added ? "scale(0.98)" : "scale(1)",
                                }}
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
