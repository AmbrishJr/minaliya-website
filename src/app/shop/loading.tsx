export default function ShopLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream-50)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{ background: "white", border: "1px solid var(--color-stone-200)" }}
            >
              <div className="aspect-[3/4]" style={{ background: "var(--color-stone-100)" }} />
              <div className="p-6 space-y-3">
                <div className="h-4 w-3/4 rounded" style={{ background: "var(--color-stone-100)" }} />
                <div className="h-4 w-1/2 rounded" style={{ background: "var(--color-stone-100)" }} />
                <div className="h-8 w-1/3 rounded-full" style={{ background: "var(--color-stone-100)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
