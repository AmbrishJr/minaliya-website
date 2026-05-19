import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopContent from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop Pure Cold Pressed Oils",
  description:
    "Browse our collection of 100% pure wooden cold pressed oils. Groundnut, coconut, and sesame oils — traditionally extracted using Mara Chekku methods. Free shipping above ₹499.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Pure Cold Pressed Oils | Minaliya",
    description:
      "100% pure wooden cold pressed groundnut, coconut & sesame oils. Order online with free shipping.",
    url: "https://minaliya.com/shop",
  },
};

export default function ShopPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        {/* Hero Banner */}
        <section
          className="relative overflow-hidden py-20 sm:py-28"
          style={{
            background:
              "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-amber-50) 50%, var(--color-cream-200) 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 translate-x-1/3 -translate-y-1/3"
            style={{ background: "radial-gradient(circle, var(--color-amber-300), transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 -translate-x-1/3 translate-y-1/3"
            style={{ background: "radial-gradient(circle, var(--color-forest-300), transparent 70%)" }}
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
              Our Pure <span className="italic font-normal">Cold Pressed</span> Oils
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-stone-500)" }}
            >
              Handpicked seeds, traditional wooden press extraction, and fresh
              bottling — experience the authentic taste of purity in every drop.
            </p>
          </div>
        </section>

        <ShopContent />
      </main>

      <Footer />
    </>
  );
}
