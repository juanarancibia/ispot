export default function Footer() {
    return (
        <footer className="bg-th-surface-alt border-t border-th-border" style={{ transition: "background-color 0.3s ease" }}>
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
                <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 py-12 sm:py-16">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <h3 className="text-xl font-bold tracking-tight text-th-text mb-3" style={{ letterSpacing: "-0.05em" }}>
                            ISPOT IMPORT
                        </h3>
                        <p className="text-th-muted text-sm leading-relaxed">
                            Equipamiento original de fábrica.
                            <br />
                            Importación de equipos premium.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-12 sm:gap-16 flex-wrap">
                        <div>
                            <h4 className="text-sm font-semibold text-th-text mb-4 tracking-tight">Contacto</h4>
                            <div className="space-y-3">
                                <a
                                    href="https://wa.me/5493517669886"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-th-muted hover:text-th-text transition-colors"
                                >
                                    WhatsApp: +54 9 351 766 9886
                                </a>
                                <a
                                    href="https://www.instagram.com/ispotcba/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-th-muted hover:text-th-text transition-colors"
                                >
                                    Instagram: @ispotcba
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-th-text mb-4 tracking-tight">Ubicación</h4>
                            <div className="space-y-3">
                                <p className="text-sm text-th-muted">Córdoba, Argentina 🇦🇷</p>
                                <p className="text-sm text-th-muted">Ventas a todo el país</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-th-border py-6 text-center">
                    <p className="text-xs text-th-muted opacity-60">
                        © {new Date().getFullYear()} ISPOT IMPORT. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
