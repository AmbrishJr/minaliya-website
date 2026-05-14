import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Minaliya Journal",
  description:
    "Read our latest articles on cold pressed oils, healthy cooking, and traditional wellness.",
  alternates: { canonical: "/blog" },
};

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Placeholder blog content for any slug
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <article className="py-12 sm:py-20" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Back button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:underline"
              style={{ color: "var(--color-stone-500)" }}
            >
              <ArrowLeft size={16} />
              Back to Journal
            </Link>

            {/* Header */}
            <header className="space-y-6 mb-12">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-forest-100)",
                    color: "var(--color-forest-700)",
                  }}
                >
                  Health & Nutrition
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--color-stone-400)" }}>
                  April 28, 2026
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-stone-900)",
                }}
              >
                The Ancient Art of Mara Chekku Oil Extraction
              </h1>

              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
                <Clock size={16} />
                <span>5 min read</span>
              </div>
            </header>

            {/* Featured Image Placeholder */}
            <div
              className="w-full aspect-[21/9] rounded-2xl mb-12"
              style={{
                background: "linear-gradient(135deg, var(--color-wood-100) 0%, var(--color-cream-200) 100%)",
                border: "1px solid var(--color-stone-200)"
              }}
            />

            {/* Content */}
            <div className="prose prose-lg prose-stone max-w-none space-y-6">
              <p className="lead text-xl leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                For centuries, the rhythmic sound of the wooden press, or Mara Chekku, echoed through the villages of Tamil Nadu. It wasn&apos;t just a method of oil extraction; it was a revered tradition that ensured the purity and vitality of the oil were preserved.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                What is Mara Chekku?
              </h2>
              
              <p className="leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                Mara Chekku translates directly to &quot;wooden press&quot; in Tamil. Traditionally, a large pestle made of Vaagai wood (Albizia lebbeck) is rotated within a wooden mortar. This slow, steady rotation crushes seeds or nuts to extract oil.
              </p>

              <div className="p-6 my-8 rounded-2xl" style={{ background: "var(--color-cream-100)", border: "1px solid var(--color-stone-200)" }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-forest-700)" }}>Why Vaagai Wood?</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                  The Vaagai tree is known for its medicinal properties. More importantly, it absorbs heat, ensuring that the oil temperature never exceeds 50°C during extraction.
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                The Problem with Modern Refining
              </h2>
              
              <p className="leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                Modern refined oils prioritize yield and shelf life over nutrition. Seeds are subjected to extreme heat (often above 200°C) and chemical solvents like hexane. This process strips the oil of its natural vitamins, antioxidants, and authentic flavor, leaving behind a clear, odorless liquid that offers little to no nutritional value.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                Why Cold Pressed is Better
              </h2>
              
              <ul className="list-disc pl-6 space-y-2 leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                <li><strong>Nutrient Retention:</strong> Vitamins like E and essential fatty acids remain intact.</li>
                <li><strong>Natural Flavor and Aroma:</strong> The oil smells and tastes like the seed it came from.</li>
                <li><strong>Chemical-Free:</strong> No bleaching, deodorizing, or harsh solvents are used.</li>
              </ul>
              
              <p className="mt-8 leading-relaxed font-medium italic" style={{ color: "var(--color-stone-500)" }}>
                At Minaliya, we are committed to keeping this tradition alive. Our oils are purely extracted using the Mara Chekku method, delivering the authentic taste and health benefits your family deserves.
              </p>
            </div>

            {/* Author */}
            <div className="mt-16 pt-8 border-t flex items-center gap-4" style={{ borderColor: "var(--color-stone-200)" }}>
               <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    background: "var(--color-forest-100)",
                    color: "var(--color-forest-700)",
                  }}
                >
                  M
                </div>
                <div>
                  <div className="font-semibold" style={{ color: "var(--color-stone-800)" }}>The Minaliya Team</div>
                  <div className="text-sm" style={{ color: "var(--color-stone-500)" }}>Passionate about traditional wellness and pure foods.</div>
                </div>
            </div>

          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
