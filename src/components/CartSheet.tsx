"use client";
import { formatMoney } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ChevronRight, MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";

interface CartSheetProps {
    whatsappVendedor: string;
}

export default function CartSheet({ whatsappVendedor }: CartSheetProps) {
    const [open, setOpen] = useState(false);
    const { items, removeItem, updateCantidad, clearCart, totalItems, getTotalTexts } = useCartStore();

    const handlePedido = () => {
        if (items.length === 0) return;

        const lineas = items.map(
            (item) => {
                const priceStr = item.producto.precio_final_ars
                    ? formatMoney(item.producto.precio_final_ars * item.cantidad, "ARS")
                    : formatMoney(item.producto.precio_final_usd * item.cantidad, "USD");
                return `- ${item.cantidad}x ${item.producto.marca} ${item.producto.modelo}${item.varianteSeleccionada ? ` (${item.varianteSeleccionada})` : ""} - ${priceStr}`;
            }
        );

        const totalTextsStr = getTotalTexts().join(" + ");
        const textoResumen = `Hola, quiero realizar el siguiente pedido:\n${lineas.join("\n")}\n\nTotal: ${totalTextsStr}`;
        window.open(
            `https://wa.me/${whatsappVendedor}?text=${encodeURIComponent(textoResumen)}`,
            "_blank"
        );
    };

    const itemCount = totalItems();

    return (
        <>
            {/* FAB */}
            <button
                id="cart-button"
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 text-white pl-4 pr-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium text-sm cursor-pointer"
                style={{
                    background: "var(--theme-accent)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                }}
                aria-label="Abrir carrito"
            >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Carrito</span>
                {itemCount > 0 && (
                    <span
                        className="text-[11px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 ml-0.5"
                        style={{ background: "white", color: "var(--theme-accent)" }}
                    >
                        {itemCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    style={{
                        background: "var(--theme-overlay)",
                        backdropFilter: "blur(5px)",
                        WebkitBackdropFilter: "blur(5px)",
                    }}
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sheet sidebar */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full sm:max-w-md flex flex-col transition-transform duration-400 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
                style={{
                    background: "var(--theme-modal)",
                    borderLeft: "1px solid var(--theme-card-border)",
                    boxShadow: open ? "-10px 0 30px rgba(0,0,0,0.5)" : "none",
                    transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-4 sm:px-5 py-4"
                    style={{ borderBottom: "1px solid var(--theme-card-border)" }}
                >
                    <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--theme-text)" }}>
                        <ShoppingCart size={18} style={{ color: "var(--theme-accent)" }} />
                        Tu Pedido
                        {itemCount > 0 && (
                            <span className="text-xs font-normal" style={{ color: "var(--theme-muted)" }}>
                                ({itemCount})
                            </span>
                        )}
                    </h2>
                    <button
                        id="cart-close-button"
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                        style={{ background: "var(--theme-input)", color: "var(--theme-muted)" }}
                        aria-label="Cerrar carrito"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "var(--theme-muted)" }}>
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: "var(--theme-card)", border: "1px solid var(--theme-card-border)" }}
                            >
                                <ShoppingCart size={28} className="opacity-30" />
                            </div>
                            <p className="text-sm">Tu bolsa está vacía.</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const key = `${item.producto.id}-${item.varianteSeleccionada}`;
                            return (
                                <div
                                    key={key}
                                    className="rounded-xl p-3.5 flex gap-3"
                                    style={{
                                        background: "var(--theme-card)",
                                        border: "1px solid var(--theme-card-border)",
                                    }}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate" style={{ color: "var(--theme-text)" }}>
                                            {item.producto.marca} {item.producto.modelo}
                                        </p>
                                        {item.varianteSeleccionada && (
                                            <p className="text-[11px] mt-0.5" style={{ color: "var(--theme-muted)" }}>
                                                {item.varianteSeleccionada}
                                            </p>
                                        )}
                                        <div className="mt-1">
                                            {item.producto.precio_final_ars ? (
                                                <p className="font-bold text-sm" style={{ color: "var(--theme-accent)" }}>
                                                    {formatMoney(item.producto.precio_final_ars * item.cantidad, "ARS")}
                                                </p>
                                            ) : (
                                                <p className="font-bold text-sm" style={{ color: "var(--theme-accent)" }}>
                                                    {formatMoney(item.producto.precio_final_usd * item.cantidad, "USD")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Quantity controls */}
                                    <div className="flex flex-col items-center justify-between gap-1">
                                        <div
                                            className="flex items-center gap-1.5 rounded-lg px-1 py-0.5"
                                            style={{ background: "var(--theme-input)", border: "1px solid var(--theme-card-border)" }}
                                        >
                                            <button
                                                onClick={() =>
                                                    updateCantidad(item.producto.id, item.varianteSeleccionada, item.cantidad - 1)
                                                }
                                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                                style={{ color: "var(--theme-muted)" }}
                                                aria-label="Restar cantidad"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center" style={{ color: "var(--theme-text)" }}>
                                                {item.cantidad}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateCantidad(item.producto.id, item.varianteSeleccionada, item.cantidad + 1)
                                                }
                                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                                style={{ color: "var(--theme-muted)" }}
                                                aria-label="Sumar cantidad"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.producto.id, item.varianteSeleccionada)}
                                            className="transition-colors p-1 cursor-pointer"
                                            style={{ color: "#ff3b30", opacity: 0.8 }}
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

                {/* Footer with total and CTA */}
                {items.length > 0 && (
                    <div
                        className="px-4 sm:px-5 py-4 space-y-3"
                        style={{
                            borderTop: "1px solid var(--theme-card-border)",
                            background: "var(--theme-modal)",
                        }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm" style={{ color: "var(--theme-muted)" }}>Total</span>
                            <span className="text-xl font-bold" style={{ color: "var(--theme-text)" }}>
                                {getTotalTexts().join(" + ")}
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--theme-muted)" }}>
                            * Los pagos en <strong style={{ color: "var(--theme-text)" }}>Pesos</strong> están sujetos a la cotización Dólar Blue del día de pago.
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                id="hacer-pedido-button"
                                onClick={handlePedido}
                                className="w-full py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] font-semibold cursor-pointer"
                                style={{
                                    background: "#25D366",
                                    color: "white",
                                    boxShadow: "0 4px 12px rgba(37, 211, 102, 0.2)",
                                }}
                            >
                                <MessageCircle size={18} />
                                WhatsApp
                                <ChevronRight size={16} className="opacity-60" />
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full text-xs transition-colors py-1 cursor-pointer"
                                style={{ color: "var(--theme-muted)", background: "transparent", border: "none" }}
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
