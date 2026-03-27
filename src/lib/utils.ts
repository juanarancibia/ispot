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
    mostrarArs: boolean,
    precioManualUsd?: number | null,
    precioManualArs?: number | null
): { precio_final_usd: number; precio_final_ars: number | null } {
    let precio_final_usd = Math.round((precioUsd * margen) / 10) * 10;
    if (precioManualUsd != null && precioManualUsd > 0) {
        precio_final_usd = precioManualUsd;
    }

    let precio_final_ars: number | null = null;
    if (mostrarArs) {
        if (precioManualArs != null && precioManualArs > 0) {
            precio_final_ars = precioManualArs;
        } else if (precioArs !== null && precioArs > 0) {
            precio_final_ars = Math.round((precioArs * margen) / 10) * 10;
        }
    }

    return {
        precio_final_usd,
        precio_final_ars,
    };
}

/**
 * Normaliza el nombre del producto para generar el nombre del archivo de la imagen.
 * Ej: "Apple", "iPhone 17 Pro Max 512GB" -> "apple-iphone-17-pro-max"
 */
export function getNormalizedProductName(marca: string, modelo: string): string {
    const raw = `${modelo}`;
    const normalizedName = raw
        .toLowerCase()
        .normalize("NFD") // Descompone caracteres con acentos
        .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
        .replace(/\b\d+\s*(gb|tb)\b/gi, "") // Elimina capacidades como 256gb, 512 gb, 1 tb
        .replace(/[^a-z0-9]+/g, "-") // Reemplaza no-alfanuméricos con guiones (-).
        .replace(/^-+|-+$/g, ""); // Elimina guiones al principio y final

    console.log("normalizedName", normalizedName);
    
    return normalizedName;
}
