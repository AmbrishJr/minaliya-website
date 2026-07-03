export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-cream-50)" }}>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent mx-auto mb-4"
          style={{
            borderColor: "var(--color-forest-200)",
            borderTopColor: "var(--color-forest-600)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p className="text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
