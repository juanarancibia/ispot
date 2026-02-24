import { ArrowLeft, Settings } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Panel Admin — ISpot",
    robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Sidebar / Header */}
            <header className="border-b border-zinc-800 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-sm transition-colors mr-2"
                    >
                        <ArrowLeft size={16} />
                        Ver tienda
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Settings size={20} className="text-emerald-400" />
                        <span>Panel de Administración</span>
                    </div>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        </div>
    );
}
