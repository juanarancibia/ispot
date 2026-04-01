"use client";

import { Menu, X, ChevronRight, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HamburgerMenu({ categorias }: { categorias: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 -ml-1 text-th-muted hover:text-th-text rounded-lg transition-colors cursor-pointer"
                style={{ background: "transparent" }}
                aria-label="Abrir menú de navegación"
            >
                <Menu size={22} />
            </button>

            <div
                className={`fixed inset-0 z-[100] transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-th-overlay"
                    style={{ backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)" }}
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={`absolute left-0 top-0 w-[80%] max-w-[320px] h-[100dvh] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                    style={{
                        background: "var(--theme-modal)",
                        borderRight: "1px solid var(--theme-border)",
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-th-border">
                        <h2 className="text-lg font-semibold tracking-tight text-th-text">Navegación</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 -mr-2 text-th-muted hover:text-th-text transition-colors rounded-full cursor-pointer"
                            style={{ background: "transparent" }}
                            aria-label="Cerrar menú"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === "/"
                                ? "bg-th-accent-light text-th-accent font-medium"
                                : "text-th-text hover:bg-th-card-hover"
                                }`}
                        >
                            <Home size={18} className={pathname === "/" ? "text-th-accent" : "text-th-muted"} />
                            <span>Inicio</span>
                        </Link>

                        <div className="mt-4 mb-2 px-4">
                            <h3 className="text-xs font-semibold text-th-muted uppercase tracking-widest">
                                Categorías
                            </h3>
                        </div>

                        {categorias.map((c) => {
                            const slug = encodeURIComponent(c);
                            const href = `/categoria/${slug}`;
                            const decodedPath = decodeURIComponent(pathname);
                            const isCategoryMatch = decodedPath === `/categoria/${c}`;

                            return (
                                <Link
                                    key={c}
                                    href={href}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isCategoryMatch
                                        ? "bg-th-accent-light text-th-accent font-medium"
                                        : "text-th-text hover:bg-th-card-hover"
                                        }`}
                                >
                                    <span>{c}</span>
                                    <ChevronRight size={16} className={isCategoryMatch ? "text-th-accent" : "text-th-muted opacity-40"} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-th-border flex justify-center">
                        <span className="text-xs font-bold tracking-tighter text-th-muted opacity-40">ISPOT IMPORT</span>
                    </div>
                </div>
            </div>
        </>
    );
}
