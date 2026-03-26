import fs from "fs";
import path from "path";
import { getNormalizedProductName } from "./utils";

const DEFAULT_IMAGE = "/assets/ispot_logo.jpg";

/**
 * Server-only utility to check if a product image exists in the assets folder.
 * Using fs to dynamically scan the public directory without breaking client components.
 */
export function getProductImageServerFallback(marca: string, modelo: string): string {
    try {
        const normalizedName = getNormalizedProductName(marca, modelo);
        // Buscamos directamente en public/assets
        const assetsDir = path.join(process.cwd(), "public", "assets", "products");

        if (!fs.existsSync(assetsDir)) {
            return DEFAULT_IMAGE;
        }

        const files = fs.readdirSync(assetsDir);
        
        // Buscamos cualquier archivo que coincida con el nombre y sea una imagen
        const matchingFile = files.find((file) => {
            const ext = path.extname(file).toLowerCase();
            const nameWithoutExt = path.basename(file, ext);
            return (
                nameWithoutExt === normalizedName &&
                [".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(ext)
            );
        });

        if (matchingFile) {
            return `/assets/products/${matchingFile}`;
        }
    } catch (error) {
        console.error("Error reading assets directory:", error);
    }

    return DEFAULT_IMAGE;
}
