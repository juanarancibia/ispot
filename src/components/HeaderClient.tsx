"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function HeaderClient() {
    return (
        <>
            {/* Center: Logo + Location */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold tracking-tighter text-th-text">
                    ISPOT IMPORT
                </span>
                <span
                    className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold text-th-muted border border-th-border"
                    style={{ background: "var(--theme-input)", letterSpacing: "0.05em" }}
                >
                    {/* Argentina Flag SVG */}
                    <svg viewBox="0 0 64 40" width="14" height="9" className="rounded-sm" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}>
                        <rect width="64" height="40" fill="#74acdf" />
                        <rect y="13.3" width="64" height="13.4" fill="#fff" />
                        <circle cx="32" cy="20" r="3.5" fill="#f6b40e" />
                    </svg>
                    CBA-ARG
                </span>
            </Link>

            {/* Right: Theme toggle */}
            <div className="flex items-center gap-2">
                <ThemeToggle />
            </div>
        </>
    );
}
