export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-400)]"
      style={{
        background: "var(--color-forest-600)",
        color: "white",
      }}
    >
      Skip to main content
    </a>
  );
}
