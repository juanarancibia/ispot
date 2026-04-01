export default function Loading() {
    return (
        <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:pt-20">
                {/* Hero Skeleton */}
                <div className="flex flex-col items-center text-center mb-16 animate-pulse">
                    <div className="h-14 w-64 sm:w-96 bg-th-card-border rounded-3xl mb-4" />
                    <div className="h-4 w-48 sm:w-80 bg-th-card-border rounded-full mb-8" />
                    <div className="flex gap-4">
                        <div className="h-12 w-32 bg-th-card-border rounded-full" />
                        <div className="h-12 w-32 bg-th-card-border rounded-full" />
                    </div>
                </div>

                {/* Brands Skeleton */}
                <div className="grid gap-5 mb-20 animate-pulse" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-48 rounded-[20px] border border-th-card-border bg-th-card opacity-50"
                        />
                    ))}
                </div>

                {/* Products Title */}
                <div className="h-8 w-48 bg-th-card-border rounded-lg mb-8 animate-pulse" />

                {/* Grid Skeleton */}
                <div className="grid gap-5 animate-pulse" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
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
