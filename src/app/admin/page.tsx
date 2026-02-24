"use client";

import { formatARS } from "@/lib/utils";
import type { ConfigNegocio, Producto } from "@/types";
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";

type StockData = { prov_1: Producto[]; prov_2: Producto[] };

export default function AdminPage() {
    const [config, setConfig] = useState<ConfigNegocio>({
        cotizacion_usd: 1450,
        margen_prov_1: 1.15,
        margen_prov_2: 1.2,
        whatsapp_vendedor: "",
    });
    const [stock, setStock] = useState<StockData>({ prov_1: [], prov_2: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    // Cargar config y stock al montar
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [configRes, stockP1Res, stockP2Res] = await Promise.all([
                    fetch("/api/config"),
                    fetch("/api/stock?proveedor=prov_1"),
                    fetch("/api/stock?proveedor=prov_2"),
                ]);
                if (configRes.ok) setConfig(await configRes.json());
                if (stockP1Res.ok) {
                    const p1 = await stockP1Res.json();
                    const p2 = stockP2Res.ok ? await stockP2Res.json() : [];
                    setStock({ prov_1: p1, prov_2: p2 });
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            const res = await fetch("/api/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            setStatus(res.ok ? "success" : "error");
        } catch {
            setStatus("error");
        } finally {
            setSaving(false);
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleRefreshStock = async () => {
        setLoading(true);
        try {
            const [p1Res, p2Res] = await Promise.all([
                fetch("/api/stock?proveedor=prov_1"),
                fetch("/api/stock?proveedor=prov_2"),
            ]);
            if (p1Res.ok && p2Res.ok) {
                setStock({ prov_1: await p1Res.json(), prov_2: await p2Res.json() });
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-600 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors";

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-bold">Configuración del Negocio</h1>

            {/* Formulario de configuración */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-zinc-200">Parámetros Generales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label htmlFor="cotizacion_usd" className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            Cotización USD (ARS)
                        </label>
                        <input
                            id="cotizacion_usd"
                            type="number"
                            value={config.cotizacion_usd}
                            onChange={(e) => setConfig((c) => ({ ...c, cotizacion_usd: Number(e.target.value) }))}
                            className={inputClass}
                            min={0}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="whatsapp_vendedor" className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            WhatsApp Vendedor (con código de país)
                        </label>
                        <input
                            id="whatsapp_vendedor"
                            type="text"
                            value={config.whatsapp_vendedor}
                            onChange={(e) => setConfig((c) => ({ ...c, whatsapp_vendedor: e.target.value }))}
                            placeholder="Ej: 5491123456789"
                            className={inputClass}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="margen_prov_1" className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            Margen Proveedor 1 (ej: 1.15 = 15%)
                        </label>
                        <input
                            id="margen_prov_1"
                            type="number"
                            step="0.01"
                            value={config.margen_prov_1}
                            onChange={(e) => setConfig((c) => ({ ...c, margen_prov_1: Number(e.target.value) }))}
                            className={inputClass}
                            min={1}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="margen_prov_2" className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            Margen Proveedor 2 (ej: 1.20 = 20%)
                        </label>
                        <input
                            id="margen_prov_2"
                            type="number"
                            step="0.01"
                            value={config.margen_prov_2}
                            onChange={(e) => setConfig((c) => ({ ...c, margen_prov_2: Number(e.target.value) }))}
                            className={inputClass}
                            min={1}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        id="save-config-button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Guardar Configuración
                    </button>
                    {status === "success" && (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                            <CheckCircle size={16} />
                            Guardado correctamente
                        </span>
                    )}
                    {status === "error" && (
                        <span className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                            <AlertCircle size={16} />
                            Error al guardar
                        </span>
                    )}
                </div>
            </section>

            {/* Stock por proveedor */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-zinc-200">Stock Actual</h2>
                    <button
                        id="refresh-stock-button"
                        onClick={handleRefreshStock}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-2 rounded-xl transition-all"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Actualizar
                    </button>
                </div>

                {(["prov_1", "prov_2"] as const).map((prov) => (
                    <div key={prov} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="font-semibold text-zinc-300">
                                {prov === "prov_1" ? "Proveedor 1" : "Proveedor 2"}
                            </h3>
                            <span className="text-xs text-zinc-500">{stock[prov].length} productos</span>
                        </div>
                        <div className="overflow-x-auto">
                            {stock[prov].length === 0 ? (
                                <p className="text-zinc-600 text-sm p-5">Sin stock cargado para este proveedor.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-zinc-800/50">
                                        <tr>
                                            {["Marca", "Modelo", "Variantes", "USD", "ARS", "Condición"].map((h) => (
                                                <th
                                                    key={h}
                                                    className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-widest"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stock[prov].map((p, idx) => (
                                            <tr
                                                key={p.id}
                                                className={`border-t border-zinc-800/60 ${idx % 2 === 0 ? "bg-transparent" : "bg-zinc-800/20"
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-zinc-400 font-medium">{p.marca}</td>
                                                <td className="px-4 py-3 text-white">{p.modelo}</td>
                                                <td className="px-4 py-3 text-zinc-400">
                                                    {p.variantes.length > 0 ? p.variantes.join(", ") : "—"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-300">
                                                    ${p.precio_usd.toLocaleString("es-AR")}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-300">
                                                    {p.precio_ars !== null ? formatARS(p.precio_ars) : "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                                        {p.condicion}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
