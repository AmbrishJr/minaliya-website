import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BenefitsSection from "@/components/home/BenefitsSection";
import WhyColdPressed from "@/components/home/WhyColdPressed";
import { HeartPulse, Activity, Brain, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Benefits of Cold Pressed Oils",
  description:
    "Learn about the health benefits of Minaliya cold pressed oils. Rich in nutrients, heart-healthy, and extracted without chemicals.",
  alternates: { canonical: "/benefits" },
};

export default function BenefitsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        {/* ─── Hero ─── */}
        <section
          className="relative overflow-hidden py-20 sm:py-28"
          style={{
            background:
              "linear-gradient(135deg, var(--color-forest-700) 0%, var(--color-forest-900) 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <div
                className="w-12 h-1 rounded-full mx-auto mb-6"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-amber-400), var(--color-amber-300))",
                }}
              />
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                color: "black",
              }}
            >
              The Science of <span className="italic font-normal">Purity</span>
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-forest-200)" }}
            >
              Discover how switching to traditional cold pressed oils can transform your family&apos;s health, digestion, and overall well-being.
            </p>
          </div>
        </section>

        {/* ─── Health Pillars ─── */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <HeartPulse size={32} />,
                  title: "Heart Health",
                  desc: "Rich in MUFA and PUFA (good fats) which help maintain healthy cholesterol levels.",
                },
                {
                  icon: <Activity size={32} />,
                  title: "Better Digestion",
                  desc: "Natural enzymes remain intact, making these oils easier for the body to break down and absorb.",
                },
                {
                  icon: <Brain size={32} />,
                  title: "Cognitive Function",
                  desc: "Packed with Omega-3 and Omega-6 fatty acids essential for brain health.",
                },
                {
                  icon: <ShieldCheck size={32} />,
                  title: "Immunity Boost",
                  desc: "High in natural antioxidants and Vitamin E that fight free radicals.",
                },
              ].map((pillar, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "var(--color-amber-100)",
                      color: "var(--color-amber-600)",
                    }}
                  >
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-stone-500)" }}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Components from Home ─── */}
        <WhyColdPressed />
        <BenefitsSection />

      </main>
      <Footer />
    </>
  );
}
