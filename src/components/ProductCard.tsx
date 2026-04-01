"use client";

import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { ProductoConPrecio } from "@/types";
import { CheckCircle2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

import { createPortal } from "react-dom";

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
    const [mounted, setMounted] = useState(false);

    const initialImgSrc = producto.imagen || "/assets/ispot_logo.jpg";
    const [imgSrc, setImgSrc] = useState(initialImgSrc);
    const isFallback = imgSrc === "/assets/ispot_logo.jpg";

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const modalContent = isModalOpen && mounted ? (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            {/* Backdrop */}
            <div
                className="fixed inset-0 transition-opacity bg-th-overlay backdrop-blur-md pointer-events-auto"
                style={{
                    WebkitBackdropFilter: "blur(12px)",
                }}
                onClick={() => setIsModalOpen(false)}
            />

            {/* Content Drawer */}
            <div
                className="relative w-full max-w-lg bg-th-modal border-t sm:border border-th-card-border sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden z-[10000] animate-mobile-drawer sm:animate-scale-in max-h-[92dvh] flex flex-col pointer-events-auto"
                style={{
                    boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
            >
                {/* Mobile Handle */}
                <div className="sm:hidden flex justify-center py-3">
                    <div className="w-10 h-1 rounded-full bg-th-card-border" />
                </div>

                {/* Top Controls */}
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-th-input text-th-muted hover:text-th-text transition-colors z-20 cursor-pointer"
                    aria-label="Cerrar"
                >
                    <X size={18} />
                </button>

                <div className="overflow-y-auto w-full pb-28 sm:pb-6 no-scrollbar">
                    {/* Image Section */}
                    <div className="w-full aspect-square sm:h-80 sm:aspect-auto flex items-center justify-center p-8 sm:p-12 mb-2">
                        <img
                            src={imgSrc}
                            alt={`${producto.marca} ${producto.modelo}`}
                            className={`w-full h-full object-contain ${isFallback ? "opacity-20 grayscale scale-75" : "drop-shadow-2xl"}`}
                        />
                    </div>

                    <div className="px-5 sm:px-10">
                        {/* Brand & Title Section */}
                        <div className="flex flex-col mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-th-input text-th-muted"
                                >
                                    {producto.marca}
                                </span>
                                <span
                                    className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: condStyle.bg, color: condStyle.text }}
                                >
                                    {producto.condicion}
                                </span>
                            </div>
                            <h2
                                className="text-2xl sm:text-3xl font-extrabold leading-tight text-th-text"
                                style={{ letterSpacing: "-0.03em" }}
                            >
                                {producto.modelo}
                            </h2>
                        </div>

                        {/* Price Section */}
                        <div className="mb-8">
                            {producto.precio_final_ars ? (
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-3xl font-black text-th-accent tracking-tight">
                                        {formatMoney(producto.precio_final_ars, "ARS")}
                                    </p>
                                    <p className="text-sm font-medium text-th-muted">
                                        {formatMoney(producto.precio_final_usd, "USD")} (Ref)
                                    </p>
                                </div>
                            ) : (
                                <p className="text-3xl font-black text-th-accent tracking-tight">
                                    {formatMoney(producto.precio_final_usd, "USD")}
                                </p>
                            )}
                        </div>

                        {/* Options Section */}
                        { (producto.almacenamiento || producto.variantes.length > 0) && (
                            <div className="mb-8">
                                <h4
                                    className="text-[10px] font-bold uppercase tracking-widest mb-4 text-th-muted"
                                >
                                    {producto.almacenamiento && !producto.variantes.length ? "Capacidad" : "Variantes disponibles"}
                                </h4>
                                
                                {producto.almacenamiento && !producto.variantes.length && (
                                    <div className="px-5 py-3 rounded-2xl text-sm font-bold border border-th-accent text-th-accent bg-th-accent-light inline-block"
                                    >
                                        {producto.almacenamiento}
                                    </div>
                                )}

                                {producto.variantes.length > 0 && (
                                    <div className="flex gap-2.5 flex-wrap">
                                        {producto.variantes.map((v) => (
                                            <button
                                                key={v}
                                                onClick={() => setVarianteSeleccionada(v)}
                                                className="px-5 py-3 rounded-2xl text-sm font-bold border transition-all duration-300 cursor-pointer"
                                                style={
                                                    varianteSeleccionada === v
                                                        ? {
                                                            background: "var(--theme-text)",
                                                            color: "var(--theme-bg)",
                                                            borderColor: "var(--theme-text)",
                                                            transform: "scale(1.05)",
                                                            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                                        }
                                                        : {
                                                            background: "var(--theme-input)",
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

                {/* Sticky Footer CTA */}
                <div
                    className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 sm:px-10 z-[10001] bg-th-modal border-t border-th-border backdrop-blur-xl bg-opacity-80"
                >
                    <button
                        onClick={handleAdd}
                        className="w-full h-14 sm:h-16 flex items-center justify-center gap-3 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl active:scale-95 cursor-pointer"
                        style={{
                            background: added ? "#34c759" : "var(--theme-accent)",
                            color: "white",
                            boxShadow: added ? "0 8px 30px rgba(52, 199, 89, 0.3)" : "0 8px 30px rgba(41, 151, 255, 0.3)",
                        }}
                    >
                        {added ? (
                            <>
                                <CheckCircle2 size={24} />
                                <span>¡Agregado al Carrito!</span>
                            </>
                        ) : (
                            <>
                                <Plus size={24} />
                                <span>Agregar a la Bolsa</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    ) : null;

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

            {/* Render Modal via Portal to avoid stacking context issues */}
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
