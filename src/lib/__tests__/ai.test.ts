import type { Producto } from "@/types";
import { readFileSync } from "fs";
import { join } from "path";
import { beforeAll, describe, expect, it } from "vitest";
import { parsearListaPrecios, splitEnSecciones } from "../ai";

// =============================================
// Helpers
// =============================================

const EXAMPLES_DIR = join(__dirname, "..", "examples");

function leerEjemplo(filename: string): string {
    return readFileSync(join(EXAMPLES_DIR, filename), "utf-8");
}

// =============================================
// Unit Tests — splitEnSecciones
// =============================================

describe("splitEnSecciones", () => {
    it("Provider 1 — splits properly based on length", () => {
        const texto = leerEjemplo("provider_1.txt");
        const secciones = splitEnSecciones(texto);

        // It either returns 1 chunk if under 200 lines, or more if larger.
        expect(secciones.length).toBeGreaterThanOrEqual(1);

        // Each section should be non-empty
        for (const s of secciones) {
            expect(s.trim().length).toBeGreaterThan(0);
        }
    });

    it("Provider 2 — fits in a single chunk or few chunks", () => {
        const texto = leerEjemplo("provider_2.txt");
        const secciones = splitEnSecciones(texto);

        expect(secciones.length).toBeGreaterThanOrEqual(1);
    });

    it("Provider 1 — no section is empty after filtering", () => {
        const texto = leerEjemplo("provider_1.txt");
        const secciones = splitEnSecciones(texto);

        for (const s of secciones) {
            const lineas = s.split("\n").filter((l) => l.trim().length > 0);
            expect(lineas.length).toBeGreaterThan(0);
        }
    });
});

// =============================================
// Integration Tests — parsearListaPrecios
// These call the real OpenAI API.
// Results are parsed ONCE per provider in beforeAll and shared across tests.
// =============================================

describe("parsearListaPrecios — Provider 1", () => {
    let productos: Producto[];

    beforeAll(async () => {
        const texto = leerEjemplo("provider_1.txt");
        productos = await parsearListaPrecios(texto, "prov_1");
        console.log(`[Test Setup] Provider 1: ${productos.length} products extracted`);
    }, 120_000);

    it("extracts a reasonable number of products", () => {
        // Provider 1 has ~100+ distinct products across all sections (172 variants extracted)
        expect(productos.length).toBeGreaterThanOrEqual(80);
        expect(productos.length).toBeLessThanOrEqual(200);
    });

    it("all products have required fields with correct types", () => {
        for (const p of productos) {
            expect(p.id).toBeDefined();
            expect(typeof p.id).toBe("string");
            expect(p.marca).toBeDefined();
            expect(typeof p.marca).toBe("string");
            expect(p.marca.length).toBeGreaterThan(0);
            expect(p.modelo).toBeDefined();
            expect(typeof p.modelo).toBe("string");
            expect(p.modelo.length).toBeGreaterThan(0);
            expect(p.categoria).toBeDefined();
            expect(typeof p.categoria).toBe("string");
            expect(p.categoria.length).toBeGreaterThan(0);
            expect(Array.isArray(p.variantes)).toBe(true);
            expect(typeof p.precio_usd).toBe("number");
            expect(p.precio_usd).toBeGreaterThan(0);
            expect(p.precio_ars === null || typeof p.precio_ars === "number").toBe(true);
            expect(["Nuevo", "Usado", "CPO", "AS IS"]).toContain(p.condicion);
            expect(p.proveedor).toBe("prov_1");
        }
    });

    it("detects multiple brands correctly", () => {
        const marcas = new Set(productos.map((p) => p.marca.toLowerCase()));

        const expectedBrands = ["apple", "samsung", "xiaomi", "motorola"];
        for (const brand of expectedBrands) {
            const found = [...marcas].some((m) => m.includes(brand));
            expect(found).toBe(true);
        }
    });

    it("detects used/CPO/AS IS conditions", () => {
        const condiciones = new Set(productos.map((p) => p.condicion));

        expect(condiciones.has("Nuevo")).toBe(true);
        expect(condiciones.has("Usado")).toBe(true);
        expect(condiciones.has("CPO")).toBe(true);
    });

    it("spot-checks specific product prices", () => {
        const findByModel = (partial: string) =>
            productos.find((p) =>
                p.modelo.toLowerCase().includes(partial.toLowerCase())
            );

        // JBL Boombox 3 → $390 USD
        const boombox3 = findByModel("Boombox 3");
        expect(boombox3).toBeDefined();
        expect(boombox3!.precio_usd).toBe(390);

        // iPhone 17 Pro Max 256GB → $1420 or $1430 USD (depending on variant)
        const i17promax256 = productos.filter((p) =>
            p.modelo.toLowerCase().includes("iphone 17 pro max") &&
            p.modelo.toLowerCase().includes("256")
        );
        expect(i17promax256.length).toBeGreaterThanOrEqual(1);
        const precios17pm = i17promax256.map((p) => p.precio_usd);
        expect(precios17pm.some((price) => price === 1420 || price === 1430)).toBe(true);

        // Samsung S25 Ultra 512GB → $1050 USD
        const s25ultra = productos.find((p) =>
            p.modelo.toLowerCase().includes("s25 ultra") &&
            p.modelo.toLowerCase().includes("512")
        );
        expect(s25ultra).toBeDefined();
        expect(s25ultra!.precio_usd).toBe(1050);
    });
});

describe("parsearListaPrecios — Provider 2", () => {
    let productos: Producto[];

    beforeAll(async () => {
        const texto = leerEjemplo("provider_2.txt");
        productos = await parsearListaPrecios(texto, "prov_2");
        console.log(`[Test Setup] Provider 2: ${productos.length} products extracted`);
    }, 120_000);

    it("extracts the correct number of products", () => {
        // Provider 2 has ~22 product lines
        expect(productos.length).toBeGreaterThanOrEqual(16);
        expect(productos.length).toBeLessThanOrEqual(28);
    });

    it("all products have required fields", () => {
        for (const p of productos) {
            expect(p.id).toBeDefined();
            expect(p.marca).toBeDefined();
            expect(p.marca.length).toBeGreaterThan(0);
            expect(p.modelo).toBeDefined();
            expect(p.modelo.length).toBeGreaterThan(0);
            expect(p.categoria).toBeDefined();
            expect(typeof p.categoria).toBe("string");
            expect(p.categoria.length).toBeGreaterThan(0);
            expect(typeof p.precio_usd).toBe("number");
            expect(p.precio_usd).toBeGreaterThan(0);
            expect(["Nuevo", "Usado", "CPO", "AS IS"]).toContain(p.condicion);
            expect(p.proveedor).toBe("prov_2");
        }
    });

    it("completes abbreviated iPhone model names", () => {
        // "14 128gb" should become "iPhone 14 128GB" or similar
        const iphone14 = productos.find((p) =>
            p.modelo.toLowerCase().includes("iphone 14") ||
            p.modelo.toLowerCase().includes("14 128")
        );
        expect(iphone14).toBeDefined();
        expect(iphone14!.modelo.toLowerCase()).toContain("iphone");
    });

    it("spot-checks specific product prices", () => {
        const findByModel = (partial: string) =>
            productos.find((p) =>
                p.modelo.toLowerCase().includes(partial.toLowerCase())
            );

        // iPhone 16 128gb → $770
        const i16 = findByModel("16 128");
        expect(i16).toBeDefined();
        expect(i16!.precio_usd).toBe(770);

        // iPhone 17 Pro Max 1TB → $1900 or $1950
        const i17pm1tb = productos.filter((p) =>
            p.modelo.toLowerCase().includes("17 pro max") &&
            p.modelo.toLowerCase().includes("1tb")
        );
        expect(i17pm1tb.length).toBeGreaterThanOrEqual(1);
        const precios = i17pm1tb.map((p) => p.precio_usd);
        expect(precios.some((price) => price === 1900 || price === 1950)).toBe(true);
    });

    it("all products are Apple brand (or unbranded accessories inferred)", () => {
        for (const p of productos) {
            const marca = p.marca.toLowerCase();
            const allowed = ["apple", "otros", "infinix", "", "genérico", "generico"];
            expect(allowed.includes(marca)).toBe(true);
        }
    });

    it("handles double dollar sign correctly", () => {
        // "$$1420" in the source should be parsed as 1420
        const orangeBlue = productos.find((p) =>
            p.modelo.toLowerCase().includes("17 pro max") &&
            p.precio_usd === 1420
        );
        expect(orangeBlue).toBeDefined();
    });
});
