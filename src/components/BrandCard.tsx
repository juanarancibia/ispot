"use client";

import Link from "next/link";

interface BrandCardProps {
    brand: string;
    count: number;
    gradient: {
        base: string;
        hover: string;
        textHover: string;
    };
    index: number;
}

export default function BrandCard({ brand, count, gradient, index }: BrandCardProps) {
    return (
        <Link
            href={`/marca/${encodeURIComponent(brand)}`}
            className={`group relative overflow-hidden text-center cursor-pointer animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
            style={{
                background: gradient.base,
                border: "1px solid var(--theme-card-border)",
                borderRadius: "var(--card-radius)",
                padding: "3rem 2rem",
                transition: "var(--transition)",
                display: "block",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = gradient.hover;
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.4)";
                e.currentTarget.style.borderColor = "var(--theme-border-strong)";
                const h3 = e.currentTarget.querySelector("h3");
                if (h3) (h3 as HTMLElement).style.color = gradient.textHover;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = gradient.base;
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--theme-card-border)";
                const h3 = e.currentTarget.querySelector("h3");
                if (h3) (h3 as HTMLElement).style.color = "var(--theme-text)";
            }}
        >
            <h3
                className="text-3xl sm:text-4xl font-semibold transition-colors duration-300"
                style={{ color: "var(--theme-text)", letterSpacing: "-0.02em" }}
            >
                {brand}
            </h3>
            <p className="mt-2 text-sm" style={{ color: "var(--theme-muted)" }}>
                {count} {count === 1 ? "producto" : "productos"}
            </p>
        </Link>
    );
}
