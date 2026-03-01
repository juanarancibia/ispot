import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Panel Admin — iSpot",
    robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-200/50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-sm transition-colors mr-2"
                    >
                        <ArrowLeft size={16} />
                        Ver tienda
                    </Link>
                    <div className="flex items-center gap-3 font-bold text-lg">
                        <img src="/assets/ispot_logo.jpg" alt="iSpot" className="h-7 w-auto" />
                        <span className="text-neutral-300">|</span>
                        <span className="text-neutral-600 text-sm font-medium">Admin</span>
                    </div>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        </div>
    );
}
