export default function Loading() {
    return (
        <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-10 sm:py-20 animate-pulse">
                {/* Hero Skeleton */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="h-4 w-32 bg-th-card-border rounded-full mb-6" />
                    <div className="h-12 w-64 sm:w-96 bg-th-card-border rounded-2xl mb-4" />
                    <div className="h-4 w-48 sm:w-80 bg-th-card-border rounded-full" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="h-72 rounded-[20px] border border-th-card-border bg-th-card opacity-50"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
