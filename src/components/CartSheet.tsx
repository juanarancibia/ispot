"use client";

import { formatARS } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ChevronRight, MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";

interface CartSheetProps {
    whatsappVendedor: string;
}

export default function CartSheet({ whatsappVendedor }: CartSheetProps) {
    const [open, setOpen] = useState(false);
    const { items, removeItem, updateCantidad, clearCart, totalItems, totalARS } = useCartStore();

    const handlePedido = () => {
        if (items.length === 0) return;

        const lineas = items.map(
            (item) =>
                `- ${item.cantidad}x ${item.producto.marca} ${item.producto.modelo}${item.varianteSeleccionada ? ` (${item.varianteSeleccionada})` : ""
                } - ${formatARS(item.producto.precio_final_ars * item.cantidad)}`
        );

        const textoResumen = `Hola, quiero realizar el siguiente pedido:\n${lineas.join("\n")}\n\nTotal: ${formatARS(totalARS())}`;
        window.open(
            `https://wa.me/${whatsappVendedor}?text=${encodeURIComponent(textoResumen)}`,
            "_blank"
        );
    };

    const itemCount = totalItems();

    return (
        <>
            {/* FAB del carrito */}
            <button
                id="cart-button"
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white pl-4 pr-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 active:scale-95 font-medium text-sm"
                aria-label="Abrir carrito"
            >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Carrito</span>
                {itemCount > 0 && (
                    <span className="bg-white text-blue-700 text-[11px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 ml-0.5">
                        {itemCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sheet */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full sm:max-w-md bg-white text-neutral-900 border-l border-neutral-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                        <ShoppingCart size={18} className="text-blue-600" />
                        Mi Carrito
                        {itemCount > 0 && (
                            <span className="text-xs text-neutral-500 font-normal">({itemCount})</span>
                        )}
                    </h2>
                    <button
                        id="cart-close-button"
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                                <ShoppingCart size={28} className="opacity-30" />
                            </div>
                            <p className="text-sm">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const key = `${item.producto.id}-${item.varianteSeleccionada}`;
                            return (
                                <div
                                    key={key}
                                    className="bg-neutral-50 rounded-xl p-3.5 flex gap-3 border border-neutral-100"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-neutral-900 truncate">
                                            {item.producto.marca} {item.producto.modelo}
                                        </p>
                                        {item.varianteSeleccionada && (
                                            <p className="text-[11px] text-neutral-500 mt-0.5">{item.varianteSeleccionada}</p>
                                        )}
                                        <p className="text-blue-600 font-bold mt-1 text-sm">
                                            {formatARS(item.producto.precio_final_ars * item.cantidad)}
                                        </p>
                                    </div>
                                    {/* Controles cantidad */}
                                    <div className="flex flex-col items-center justify-between gap-1">
                                        <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-1 py-0.5">
                                            <button
                                                onClick={() =>
                                                    updateCantidad(item.producto.id, item.varianteSeleccionada, item.cantidad - 1)
                                                }
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 active:bg-neutral-100 transition-colors"
                                                aria-label="Restar cantidad"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="text-neutral-900 font-bold text-sm w-4 text-center">
                                                {item.cantidad}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateCantidad(item.producto.id, item.varianteSeleccionada, item.cantidad + 1)
                                                }
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 active:bg-neutral-100 transition-colors"
                                                aria-label="Sumar cantidad"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.producto.id, item.varianteSeleccionada)}
                                            className="text-neutral-400 hover:text-red-500 active:text-red-500 transition-colors p-1"
                                            aria-label="Eliminar del carrito"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer con total y CTA */}
                {items.length > 0 && (
                    <div className="border-t border-neutral-200 px-4 sm:px-5 py-4 space-y-3 bg-white">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 text-sm">Total</span>
                            <span className="text-neutral-900 text-xl font-bold">{formatARS(totalARS())}</span>
                        </div>
                        <button
                            id="hacer-pedido-button"
                            onClick={handlePedido}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md shadow-blue-600/20"
                        >
                            <MessageCircle size={18} />
                            Pedir por WhatsApp
                            <ChevronRight size={16} className="opacity-60" />
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full text-neutral-400 hover:text-red-500 active:text-red-500 text-xs transition-colors py-1"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
