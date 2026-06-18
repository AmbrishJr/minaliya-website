export default function BlogLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream-50)" }}>
      <div
        className="py-28"
        style={{
          background:
            "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-wood-50) 50%, var(--color-cream-200) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-4 w-16 mx-auto rounded mb-6 animate-pulse" style={{ background: "var(--color-stone-200)" }} />
          <div className="h-12 w-96 mx-auto rounded animate-pulse" style={{ background: "var(--color-stone-200)" }} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{ background: "white", border: "1px solid var(--color-stone-200)" }}
            >
              <div className="h-52" style={{ background: "var(--color-stone-100)" }} />
              <div className="p-6 space-y-3">
                <div className="h-3 w-1/4 rounded" style={{ background: "var(--color-stone-100)" }} />
                <div className="h-5 w-full rounded" style={{ background: "var(--color-stone-100)" }} />
                <div className="h-4 w-3/4 rounded" style={{ background: "var(--color-stone-100)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
