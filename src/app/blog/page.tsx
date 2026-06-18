import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Health Tips & Oil Education",
  description:
    "Read articles on cold pressed oils, healthy cooking tips, Ayurvedic wellness, and traditional oil extraction methods. From the Minaliya journal.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    title: "5 Amazing Benefits of Cold Pressed Groundnut Oil",
    excerpt:
      "Discover why cold pressed groundnut oil is the healthiest choice for Indian cooking and how it preserves essential nutrients that refined oils destroy.",
    category: "Health & Nutrition",
    readTime: "5 min read",
    date: "April 28, 2026",
    slug: "benefits-cold-pressed-groundnut-oil",
    gradient: "linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-cream-200) 100%)",
  },
  {
    title: "Refined Oil vs Cold Pressed Oil: The Complete Guide",
    excerpt:
      "A detailed comparison of refined and cold pressed oils — understand what goes into your cooking oil and make an informed, healthier choice for your family.",
    category: "Education",
    readTime: "7 min read",
    date: "April 20, 2026",
    slug: "refined-vs-cold-pressed-oil",
    gradient: "linear-gradient(135deg, var(--color-amber-100) 0%, var(--color-cream-200) 100%)",
  },
  {
    title: "The Ancient Art of Mara Chekku Oil Extraction",
    excerpt:
      "Learn about the traditional Tamil Nadu method of wooden cold pressing that has been used for centuries to extract pure oil from seeds.",
    category: "Tradition",
    readTime: "4 min read",
    date: "April 12, 2026",
    slug: "mara-chekku-oil-extraction",
    gradient: "linear-gradient(135deg, var(--color-wood-100) 0%, var(--color-cream-200) 100%)",
  },
  {
    title: "Why Sesame Oil is Called Liquid Gold in Ayurveda",
    excerpt:
      "Explore the ancient Ayurvedic significance of sesame oil (Nallennai) — from oil pulling to massage therapy, and why it's revered across South India.",
    category: "Ayurveda",
    readTime: "6 min read",
    date: "March 30, 2026",
    slug: "sesame-oil-ayurveda-benefits",
    gradient: "linear-gradient(135deg, var(--color-terra-100) 0%, var(--color-cream-200) 100%)",
  },
  {
    title: "Coconut Oil for Hair & Skin: A Complete Guide",
    excerpt:
      "From nourishing dry hair to moisturizing skin naturally — discover how virgin cold pressed coconut oil can replace chemical beauty products.",
    category: "Beauty & Wellness",
    readTime: "5 min read",
    date: "March 22, 2026",
    slug: "coconut-oil-hair-skin-guide",
    gradient: "linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-amber-50) 100%)",
  },
  {
    title: "10 South Indian Recipes That Taste Better with Cold Pressed Oil",
    excerpt:
      "From crispy dosas to aromatic sambar — 10 classic recipes where cold pressed oil makes a noticeable difference in taste and nutrition.",
    category: "Recipes",
    readTime: "8 min read",
    date: "March 14, 2026",
    slug: "south-indian-recipes-cold-pressed-oil",
    gradient: "linear-gradient(135deg, var(--color-amber-100) 0%, var(--color-terra-50) 100%)",
  },
];

export default function BlogPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-20 sm:py-28"
          style={{
            background:
              "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-wood-50) 50%, var(--color-cream-200) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
            style={{ background: "var(--color-wood-300)", filter: "blur(80px)" }}
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
              From Our <span className="italic font-normal">Journal</span>
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-stone-500)" }}
            >
              Insights on traditional oils, healthy cooking, Ayurvedic wellness,
              and recipes from the Minaliya team.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <article
                  key={i}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: "white",
                    border: "1px solid var(--color-stone-200)",
                  }}
                >
                  {/* Gradient header */}
                  <div
                    className="h-52 relative"
                    style={{ background: post.gradient }}
                  >
                    <div
                      className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "var(--color-forest-600)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div
                      className="text-xs font-medium"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      {post.date}
                    </div>
                    <h2
                      className="text-lg font-semibold leading-snug group-hover:underline decoration-1 underline-offset-4"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-stone-800)",
                      }}
                    >
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-stone-500)" }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "var(--color-stone-400)" }}
                      >
                        <Clock size={13} />
                        {post.readTime}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-xs font-semibold transition-colors hover:gap-2"
                        style={{ color: "var(--color-forest-600)" }}
                      >
                        Read More
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
