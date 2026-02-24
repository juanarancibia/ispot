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
    cotizacionUsd: number,
    margen: number
): number {
    const precioBase = precioArs !== null ? precioArs : precioUsd * cotizacionUsd;
    return Math.round(precioBase * margen);
}
