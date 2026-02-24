"use client";

import type { ItemCarrito, ProductoConPrecio } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
    items: ItemCarrito[];
    addItem: (producto: ProductoConPrecio, variante: string | null) => void;
    removeItem: (productoId: string, variante: string | null) => void;
    updateCantidad: (productoId: string, variante: string | null, cantidad: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalARS: () => number;
}

/** Genera una clave única por producto + variante para el carrito. */
const cartKey = (productoId: string, variante: string | null): string =>
    `${productoId}::${variante ?? "default"}`;

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (producto, variante) => {
                set((state) => {
                    const key = cartKey(producto.id, variante);
                    const existing = state.items.find(
                        (i) => cartKey(i.producto.id, i.varianteSeleccionada) === key
                    );
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                cartKey(i.producto.id, i.varianteSeleccionada) === key
                                    ? { ...i, cantidad: i.cantidad + 1 }
                                    : i
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { producto, varianteSeleccionada: variante, cantidad: 1 }],
                    };
                });
            },

            removeItem: (productoId, variante) => {
                set((state) => ({
                    items: state.items.filter(
                        (i) => cartKey(i.producto.id, i.varianteSeleccionada) !== cartKey(productoId, variante)
                    ),
                }));
            },

            updateCantidad: (productoId, variante, cantidad) => {
                if (cantidad <= 0) {
                    get().removeItem(productoId, variante);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        cartKey(i.producto.id, i.varianteSeleccionada) === cartKey(productoId, variante)
                            ? { ...i, cantidad }
                            : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

            totalARS: () =>
                get().items.reduce((acc, i) => acc + i.producto.precio_final_ars * i.cantidad, 0),
        }),
        {
            name: "ispot-cart",
        }
    )
);
