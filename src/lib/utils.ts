/**
 * Formatea un número como moneda en pesos argentinos (ARS).
 * Ejemplo: 1500000 → "$ 1.500.000"
 */
export function formatARS(amount: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formatea un número como moneda dependiendo del tipo.
 */
export function formatMoney(amount: number, currency: "USD" | "ARS"): string {
    if (currency === "USD") {
        return `USD ${amount.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return formatARS(amount);
}

/**
 * Genera un ID único usando timestamp y parte aleatoria.
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Calcula el precio final en ARS para un producto dado la config del negocio.
 * Prioriza el precio en ARS si existe; si no, convierte desde USD con la cotización.
 */
export function calcularPrecioFinal(
    precioUsd: number,
    precioArs: number | null,
    margen: number,
    mostrarArs: boolean
): { precio_final_usd: number; precio_final_ars: number | null } {
    const precio_final_usd = Math.round(precioUsd * margen);
    let precio_final_ars: number | null = null;

    if (mostrarArs && precioArs !== null && precioArs > 0) {
        precio_final_ars = Math.round(precioArs * margen);
    }

    return {
        precio_final_usd,
        precio_final_ars,
    };
}
