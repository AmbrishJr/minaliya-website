"use client";

type Props = {
  title: string;
  description: string;
};

export default function FooterNewsletter({ title, description }: Props) {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-stone-900)",
            }}
          >
            {title}
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--color-stone-800)" }}>
            {description}
          </p>
        </div>
        <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 md:w-72 px-5 py-3 rounded-full text-sm outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              color: "var(--color-stone-900)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
            aria-label="Email for newsletter"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 shrink-0"
            style={{
              background: "var(--color-forest-800)",
              color: "var(--color-cream-100)",
            }}
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
