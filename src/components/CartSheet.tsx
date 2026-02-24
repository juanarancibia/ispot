"use client";

import { formatARS } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
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
            {/* Botón flotante del carrito */}
            <button
                id="cart-button"
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-emerald-900/40 transition-all duration-300 hover:scale-105 font-semibold"
                aria-label="Abrir carrito"
            >
                <ShoppingCart size={20} />
                <span>Carrito</span>
                {itemCount > 0 && (
                    <span className="bg-white text-emerald-700 text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1">
                        {itemCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sheet lateral */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart size={20} className="text-emerald-400" />
                        Mi Carrito
                    </h2>
                    <button
                        id="cart-close-button"
                        onClick={() => setOpen(false)}
                        className="text-zinc-400 hover:text-white transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
                            <ShoppingCart size={48} className="opacity-30" />
                            <p className="text-sm">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const key = `${item.producto.id}-${item.varianteSeleccionada}`;
                            return (
                                <div
                                    key={key}
                                    className="bg-zinc-800/60 rounded-xl p-4 flex gap-4 border border-zinc-700/50"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {item.producto.marca} {item.producto.modelo}
                                        </p>
                                        {item.varianteSeleccionada && (
                                            <p className="text-xs text-zinc-400 mt-0.5">{item.varianteSeleccionada}</p>
                                        )}
                                        <p className="text-emerald-400 font-bold mt-1 text-sm">
                                            {formatARS(item.producto.precio_final_ars)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    updateCantidad(
                                                        item.producto.id,
                                                        item.varianteSeleccionada,
                                                        item.cantidad - 1
                                                    )
                                                }
                                                className="w-7 h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white transition-colors"
                                                aria-label="Restar cantidad"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-white font-bold w-5 text-center">{item.cantidad}</span>
                                            <button
                                                onClick={() =>
                                                    updateCantidad(
                                                        item.producto.id,
                                                        item.varianteSeleccionada,
                                                        item.cantidad + 1
                                                    )
                                                }
                                                className="w-7 h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white transition-colors"
                                                aria-label="Sumar cantidad"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                removeItem(item.producto.id, item.varianteSeleccionada)
                                            }
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                            aria-label="Eliminar del carrito"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer con total y botones */}
                {items.length > 0 && (
                    <div className="border-t border-zinc-800 p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">Total ({itemCount} ítems)</span>
                            <span className="text-white text-xl font-bold">{formatARS(totalARS())}</span>
                        </div>
                        <button
                            id="hacer-pedido-button"
                            onClick={handlePedido}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-emerald-900/40"
                        >
                            <MessageCircle size={20} />
                            Hacer Pedido por WhatsApp
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full text-zinc-500 hover:text-red-400 text-sm transition-colors"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
