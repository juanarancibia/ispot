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
                className="p-1 -ml-1 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Abrir menú de navegación"
            >
                <Menu size={24} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    <div 
                        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="relative w-[80%] max-w-[320px] h-[100dvh] bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Navegación</h2>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded-full"
                                aria-label="Cerrar menú"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Drawer Body (Enlaces) */}
                        <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
                            <Link 
                                href="/" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === "/" ? "bg-blue-50 text-blue-600 font-medium" : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"}`}
                            >
                                <Home size={18} className={pathname === "/" ? "text-blue-600" : "text-neutral-400"} />
                                <span>Inicio</span>
                            </Link>

                            <div className="mt-4 mb-2 px-4">
                                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                                    Categorías
                                </h3>
                            </div>
                            
                            {categorias.map((c) => {
                                // Para crear un slug compatible con rutas robustas
                                const slug = encodeURIComponent(c);
                                // The decoded path for comparison:
                                const expectedPath = `/categoria/${encodeURIComponent(c).replace(/%20/g, '-')}`; 
                                // wait, next.js uses raw strings. encodeURIComponent makes %20.
                                // It's safer to just encode the raw c. The router will pass it to params.slug.
                                const href = `/categoria/${slug}`;
                                
                                // To check if active, compare decoded pathname
                                const decodedPath = decodeURIComponent(pathname);
                                const isCategoryMatch = decodedPath === `/categoria/${c}`;

                                return (
                                    <Link 
                                        key={c}
                                        href={href}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isCategoryMatch ? "bg-blue-50 text-blue-600 font-medium" : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"}`}
                                    >
                                        <span>{c}</span>
                                        <ChevronRight size={16} className={isCategoryMatch ? "text-blue-600" : "text-neutral-300"} />
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* Footer Logo */}
                        <div className="p-5 border-t border-neutral-100 flex justify-center">
                            <img src="/assets/ispot_logo.jpg" alt="iSpot Logo" className="h-6 w-auto mix-blend-multiply opacity-50" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
