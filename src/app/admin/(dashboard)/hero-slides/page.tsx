import { getHeroSlides } from "@/actions/adminData";
import HeroSlidesClient from "@/components/admin/HeroSlidesClient";

export const revalidate = 0;

export default async function AdminHeroSlidesPage() {
  const slides = await getHeroSlides();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Hero Slides
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage the homepage hero carousel slides — edit text, images, colors, and ordering.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm whitespace-nowrap">
            {slides.length} Slides
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "white",
          borderColor: "var(--color-forest-200)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <HeroSlidesClient slides={slides} />
      </div>
    </div>
  );
}
