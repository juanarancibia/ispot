"use client";

import { formatARS } from "@/lib/utils";
import type { ConfigNegocio, Producto, ProveedorId } from "@/types";
import { AlertCircle, AlertTriangle, CheckCircle, Edit2, Loader2, RefreshCw, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const PROVIDERS: ProveedorId[] = ["prov_1", "prov_2", "prov_3", "prov_4", "prov_5"];

type StockData = Record<ProveedorId, Producto[]>;

const CONDICION_BADGE: Record<string, string> = {
    Nuevo: "bg-neutral-100 text-neutral-600",
    Usado: "bg-amber-100 text-amber-700",
    CPO: "bg-amber-100 text-amber-700",
    "AS IS": "bg-red-100 text-red-700",
};

export default function AdminPage() {
    const [config, setConfig] = useState<ConfigNegocio>({
        margen_prov_1: 1.15,
        margen_prov_2: 1.2,
        margen_prov_3: 1.15,
        margen_prov_4: 1.15,
        margen_prov_5: 1.15,
        whatsapp_vendedor: "",
        mostrar_ars: true,
    });
    const [stock, setStock] = useState<StockData>({
        prov_1: [], prov_2: [], prov_3: [], prov_4: [], prov_5: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState<(Producto & { proveedor: ProveedorId }) | null>(null);
    const [savingProduct, setSavingProduct] = useState(false);

    // Reset DB State
    const [resetting, setResetting] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Cargar config y stock al montar
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [configRes, ...stockResps] = await Promise.all([
                    fetch("/api/config"),
                    ...PROVIDERS.map((prov) => fetch(`/api/stock?proveedor=${prov}`))
                ]);
                
                if (configRes.ok) setConfig(await configRes.json());
                
                const newStock = { ...stock };
                for (let i = 0; i < PROVIDERS.length; i++) {
                    const prov = PROVIDERS[i];
                    const res = stockResps[i];
                    newStock[prov] = res.ok ? await res.json() : [];
                }
                setStock(newStock);
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
            const stockResps = await Promise.all(
                PROVIDERS.map((prov) => fetch(`/api/stock?proveedor=${prov}`))
            );
            
            const newStock = { ...stock };
            for (let i = 0; i < PROVIDERS.length; i++) {
                const prov = PROVIDERS[i];
                const res = stockResps[i];
                if (res.ok) {
                    newStock[prov] = await res.json();
                }
            }
            setStock(newStock);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProduct = async () => {
        if (!editingProduct) return;
        setSavingProduct(true);
        try {
            const res = await fetch("/api/stock", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct),
            });
            if (res.ok) {
                await handleRefreshStock();
                setEditingProduct(null);
            } else {
                alert("Error al guardar el producto");
            }
        } catch (err) {
            console.error(err);
            alert("Excepción al guardar producto");
        } finally {
            setSavingProduct(false);
        }
    };

    const handleDeleteProduct = async (id: string, proveedor: ProveedorId) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            const res = await fetch(`/api/stock?proveedor=${proveedor}&id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                await handleRefreshStock();
            } else {
                alert("Error al eliminar el producto");
            }
        } catch (err) {
            console.error(err);
            alert("Excepción al eliminar producto");
        }
    };

    const handleResetDB = async () => {
        setResetting(true);
        try {
            const res = await fetch("/api/reset-db", { method: "POST" });
            if (res.ok) {
                await handleRefreshStock();
                setShowResetConfirm(false);
            } else {
                alert("Error al resetear la base de datos");
            }
        } catch (err) {
            console.error(err);
            alert("Excepción al resetear db");
        } finally {
            setResetting(false);
        }
    };

    const inputClass =
        "w-full bg-neutral-50 border border-neutral-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-neutral-900 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20";

    return (
        <div className="space-y-10 relative">
            <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>

            {/* Formulario de configuración */}
            <section className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-5 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-800">Parámetros Generales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label htmlFor="whatsapp_vendedor" className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
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
                        <label htmlFor="margen_prov_1" className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                            Margen Prov 1 (%)
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
                        <label htmlFor="margen_prov_2" className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                            Margen Prov 2 (%)
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
                    <div className="space-y-1.5">
                        <label htmlFor="margen_prov_3" className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                            Margen Prov 3 (%)
                        </label>
                        <input
                            id="margen_prov_3"
                            type="number"
                            step="0.01"
                            value={config.margen_prov_3}
                            onChange={(e) => setConfig((c) => ({ ...c, margen_prov_3: Number(e.target.value) }))}
                            className={inputClass}
                            min={1}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="margen_prov_4" className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                            Margen Prov 4 (%)
                        </label>
                        <input
                            id="margen_prov_4"
                            type="number"
                            step="0.01"
                            value={config.margen_prov_4}
                            onChange={(e) => setConfig((c) => ({ ...c, margen_prov_4: Number(e.target.value) }))}
                            className={inputClass}
                            min={1}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="margen_prov_5" className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                            Margen Prov 5 (%)
                        </label>
                        <input
                            id="margen_prov_5"
                            type="number"
                            step="0.01"
                            value={config.margen_prov_5}
                            onChange={(e) => setConfig((c) => ({ ...c, margen_prov_5: Number(e.target.value) }))}
                            className={inputClass}
                            min={1}
                        />
                    </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-800">Mostrar Precios en ARS</h3>
                        <p className="text-xs text-neutral-500 mt-0.5 max-w-sm">Si se desactiva, de forzará la vista en USD ignorando los valores cargados en ARS.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={config.mostrar_ars}
                            onChange={(e) => setConfig((c) => ({ ...c, mostrar_ars: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Guardar Configuración
                    </button>
                    {status === "success" && (
                        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                            <CheckCircle size={16} />
                            Guardado correctamente
                        </span>
                    )}
                    {status === "error" && (
                        <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                            <AlertCircle size={16} />
                            Error al guardar
                        </span>
                    )}
                </div>
            </section>

            {/* Stock por proveedor */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-800">Stock Actual</h2>
                    <button
                        onClick={handleRefreshStock}
                        disabled={loading}
                        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 px-3.5 py-2 rounded-full transition-all"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Actualizar
                    </button>
                </div>

                {PROVIDERS.map((prov) => (
                    <div key={prov} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                            <h3 className="font-semibold text-neutral-800">
                                Proveedor {prov.split("_")[1]}
                            </h3>
                            <span className="text-xs text-neutral-500">{stock[prov]?.length || 0} productos</span>
                        </div>
                        <div className="overflow-x-auto">
                            {!stock[prov] || stock[prov].length === 0 ? (
                                <p className="text-neutral-400 text-sm p-5">Sin stock cargado para este proveedor.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-neutral-50/80">
                                        <tr>
                                            {["Marca", "Modelo", "Variantes", "USD", "ARS", "Condición", "Tipo", "Acciones"].map((h) => (
                                                <th
                                                    key={h}
                                                    className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-500 uppercase tracking-widest"
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
                                                className={`border-t border-neutral-100 ${idx % 2 === 0 ? "bg-transparent" : "bg-neutral-50/40"
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-neutral-600 font-medium">{p.marca}</td>
                                                <td className="px-4 py-3 text-neutral-900">{p.modelo}</td>
                                                <td className="px-4 py-3 text-neutral-500">
                                                    {p.variantes.length > 0 ? p.variantes.join(", ") : "—"}
                                                </td>
                                                <td className="px-4 py-3 text-neutral-700">
                                                    ${p.precio_usd.toLocaleString("es-AR")}
                                                </td>
                                                <td className="px-4 py-3 text-neutral-700">
                                                    {p.precio_ars && p.precio_ars > 0 ? formatARS(p.precio_ars) : "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CONDICION_BADGE[p.condicion] ?? "bg-neutral-100 text-neutral-600"}`}>
                                                        {p.condicion}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {p.precio_manual_usd || p.precio_manual_ars ? (
                                                        <span className="text-[10px] font-bold text-white bg-purple-500 px-2 py-0.5 rounded-full" title="Precio sobreescrito manualmente">
                                                            Manual
                                                        </span>
                                                    ) : "Auto"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditingProduct({ ...p, proveedor: prov })}
                                                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                                                            title="Editar producto"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p.id, prov)}
                                                            className="text-red-600 hover:text-red-800 p-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                                            title="Eliminar producto"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
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

            {/* Reset Database Section */}
            <section className="bg-red-50 border border-red-100 rounded-2xl p-6 space-y-4 shadow-sm mt-12 mb-10">
                <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2.5 rounded-full text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-red-800">Zona de Peligro: Limpiar Base de Datos</h2>
                        <p className="text-sm text-red-600/80 mt-1 max-w-xl">
                            Esta acción eliminará centralmente todo el stock cargado en los proveedores.
                            Útil si necesitas comenzar desde cero y volver a parsear mensajes.
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    {!showResetConfirm ? (
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
                        >
                            Resetear Base de Datos
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 transition-opacity">
                            <button
                                onClick={handleResetDB}
                                disabled={resetting}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
                            >
                                {resetting ? <Loader2 size={16} className="animate-spin" /> : null}
                                Sí, eliminar todo definitivamente
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                disabled={resetting}
                                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de Edición de Producto */}
            {editingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                            <h3 className="font-bold text-lg text-neutral-900">Editar Producto</h3>
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="text-neutral-400 hover:text-neutral-700 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Marca</label>
                                    <input
                                        type="text"
                                        value={editingProduct.marca}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, marca: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Modelo</label>
                                    <input
                                        type="text"
                                        value={editingProduct.modelo}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, modelo: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                                        Variantes (separadas por coma)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingProduct.variantes.join(", ")}
                                        onChange={(e) => {
                                            const parts = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                            setEditingProduct({ ...editingProduct, variantes: parts });
                                        }}
                                        className={inputClass}
                                        placeholder="Ej: 128GB, 256GB"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                                        Almacenamiento (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingProduct.almacenamiento || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, almacenamiento: e.target.value ? e.target.value : undefined })}
                                        className={inputClass}
                                        placeholder="Ej: 256GB"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Precio Proveedor USD</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={editingProduct.precio_usd}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, precio_usd: Number(e.target.value) })}
                                            className={`${inputClass} pl-7`}
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Precio Proveedor ARS (0=N/A)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={editingProduct.precio_ars || 0}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, precio_ars: Number(e.target.value) === 0 ? null : Number(e.target.value) })}
                                            className={`${inputClass} pl-7`}
                                            min={0}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Precio MANUAL USD (0=Auto)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={editingProduct.precio_manual_usd || 0}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, precio_manual_usd: Number(e.target.value) === 0 ? null : Number(e.target.value) })}
                                            className={`${inputClass} pl-7 border-purple-200 focus:ring-purple-500/20`}
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Precio MANUAL ARS (0=Auto)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={editingProduct.precio_manual_ars || 0}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, precio_manual_ars: Number(e.target.value) === 0 ? null : Number(e.target.value) })}
                                            className={`${inputClass} pl-7 border-purple-200 focus:ring-purple-500/20`}
                                            min={0}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Condición</label>
                                <select
                                    value={editingProduct.condicion}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, condicion: e.target.value as any })}
                                    className={`${inputClass} appearance-none bg-white cursor-pointer`}
                                >
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado">Usado</option>
                                    <option value="CPO">CPO</option>
                                    <option value="AS IS">AS IS</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-5 border-t border-neutral-100 flex items-center justify-end gap-3 bg-neutral-50/50">
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                disabled={savingProduct}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm"
                            >
                                {savingProduct ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
