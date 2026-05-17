import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProcessSection from "@/components/home/ProcessSection";
import {
  ArrowRight,
  Leaf,
  Users,
  Award,
  Heart,
  Sparkles,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Minaliya",
  description:
    "Discover the story behind Minaliya — our mission to bring pure, traditional wooden cold pressed oils to modern Indian kitchens. Rooted in Tamil Nadu heritage.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: <Leaf size={28} />,
    title: "100% Pure",
    desc: "No chemicals, no preservatives, no blending — just pure oil extracted from premium seeds.",
  },
  {
    icon: <Users size={28} />,
    title: "Community First",
    desc: "We work directly with local farmers in Tamil Nadu, ensuring fair prices and sustainable practices.",
  },
  {
    icon: <Award size={28} />,
    title: "Quality Assured",
    desc: "Every batch is tested for purity and quality. FSSAI approved and lab-verified.",
  },
  {
    icon: <Heart size={28} />,
    title: "Health Focused",
    desc: "Our oils retain all natural nutrients — Vitamin E, Omega fatty acids, and antioxidants.",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Families" },
  { value: "3", label: "Pure Oil Varieties" },
  { value: "100%", label: "Chemical Free" },
  { value: "4.9", label: "Customer Rating" },
];

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        {/* ─── Hero ─── */}
        <section
          className="relative overflow-hidden py-24 sm:py-32"
          style={{
            background:
              "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-forest-50) 50%, var(--color-cream-200) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-15"
            style={{ background: "var(--color-forest-300)", filter: "blur(80px)" }}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-20"
            style={{ background: "var(--color-amber-300)", filter: "blur(60px)" }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="divider-leaf mx-auto mb-6" />
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-stone-900)",
              }}
            >
              Our <span className="italic font-normal">Story</span>
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-stone-500)" }}
            >
              Bringing the ancient art of Mara Chekku to modern Indian kitchens
              — pure, traditional, and made with love in Chennai.
            </p>
          </div>
        </section>

        {/* ─── Origin Story ─── */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative transform hover:scale-105 transition-transform duration-700 ease-out">
                  <Image
                    src="/products/all_three.png"
                    alt="Minaliya Cold Pressed Oil Collection"
                    width={600}
                    height={700}
                    className="w-full h-auto drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "var(--color-forest-500)" }}
                  >
                    Where It All Began
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold leading-tight"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-stone-900)",
                    }}
                  >
                    From a Small Village Press to Your Kitchen
                  </h2>
                </div>
                <div className="space-y-4">
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--color-stone-600)" }}
                  >
                    Minaliya was born from a simple belief — that every Indian family
                    deserves access to pure, chemical-free cooking oil. In a world
                    where refined oils dominate supermarket shelves, we chose to
                    revive the traditional Mara Chekku method that has been the
                    backbone of South Indian cooking for centuries.
                  </p>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--color-stone-600)" }}
                  >
                    Our journey started in Chennai, Tamil Nadu — where we set up
                    our wooden press unit with a commitment to zero chemicals, zero
                    heat damage, and zero compromise on quality. We source premium
                    seeds directly from trusted Indian farms and extract every drop
                    at temperatures below 50°C.
                  </p>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--color-stone-600)" }}
                  >
                    Today, Minaliya oils are loved by over 10,000 families across
                    India — families who have tasted the difference that purity
                    makes. Every bottle we deliver carries the same promise: authentic
                    taste, real nutrition, and the warmth of tradition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mission & Vision ─── */}
        <section className="section-padding" style={{ background: "var(--color-surface)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              <div
                className="glass-card p-8 sm:p-10 space-y-5"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid var(--color-stone-200)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "var(--color-forest-50)",
                    color: "var(--color-forest-600)",
                  }}
                >
                  <Target size={28} />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  Our Mission
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  To make pure, traditionally-extracted cold pressed oils accessible
                  to every Indian household — replacing chemical-laden refined oils
                  with healthier, authentic alternatives that our ancestors trusted
                  for generations.
                </p>
              </div>

              {/* Vision */}
              <div
                className="glass-card p-8 sm:p-10 space-y-5"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid var(--color-stone-200)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "var(--color-amber-50)",
                    color: "var(--color-amber-600)",
                  }}
                >
                  <Sparkles size={28} />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  Our Vision
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  To become India&apos;s most trusted cold pressed oil brand — known
                  for uncompromising purity, sustainable sourcing, and a deep respect
                  for the traditional oil-making heritage of South India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Values ─── */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-14">
              <div className="divider-leaf mx-auto" />
              <h2 className="section-title">What We Stand For</h2>
              <p className="section-subtitle mx-auto">
                Every decision we make is guided by our core values — purity,
                community, quality, and health.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="text-center p-8 rounded-2xl transition-all duration-300 hover:shadow-md"
                  style={{
                    background: "white",
                    border: "1px solid var(--color-stone-200)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{
                      background: "var(--color-forest-50)",
                      color: "var(--color-forest-500)",
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-stone-800)",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-stone-500)" }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section
          style={{
            background:
              "linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-800) 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-4xl sm:text-5xl font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-amber-300)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: "var(--color-forest-200)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Process ─── */}
        <ProcessSection />

        {/* ─── CTA ─── */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Ready to Taste the Difference?</h2>
            <p className="section-subtitle mx-auto mb-10">
              Join thousands of families who have switched to pure, traditional
              cold pressed oils. Your kitchen deserves the best.
            </p>
            <Link href="/shop" className="btn-primary text-base px-10 py-4">
              Explore Our Oils
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
