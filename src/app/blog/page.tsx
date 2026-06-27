import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowRight } from "lucide-react";
import { getAllBlogs } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Health Tips & Oil Education",
  description:
    "Read articles on cold pressed oils, healthy cooking tips, Ayurvedic wellness, and traditional oil extraction methods. From the Minaliya journal.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Minaliya Journal — Cold Pressed Oil & Wellness Blog",
    description:
      "Read articles on cold pressed oils, healthy cooking tips, Ayurvedic wellness, and traditional oil extraction methods.",
    url: "https://minaliya.com/blog",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Minaliya Journal" }],
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, "");
}

function getExcerpt(blog: { content: { type: string; text?: string; items?: string[] }[] }): string {
  const firstTextBlock = blog.content.find((c) => c.text);
  if (!firstTextBlock?.text) return "";
  const cleaned = stripHtml(firstTextBlock.text);
  return cleaned.length > 160 ? cleaned.slice(0, 160) + "..." : cleaned;
}

export default async function BlogPage() {
  const posts = await getAllBlogs();

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
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "var(--color-cream-200)" }}>
                  <Clock size={24} style={{ color: "var(--color-stone-400)" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-600)" }}>
                  No articles yet
                </h3>
                <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>
                  Check back soon for new stories and insights from Minaliya.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const excerpt = getExcerpt(post);
                  return (
                    <article
                      key={post.id}
                      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{
                        background: "white",
                        border: "1px solid var(--color-stone-200)",
                      }}
                    >
                      {/* Featured Image */}
                      <div className="h-52 relative overflow-hidden">
                        {post.images[0] ? (
                          <Image
                            src={post.images[0]}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full" style={{ background: "linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-cream-200) 100%)" }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div
                          className="text-xs font-medium"
                          style={{ color: "var(--color-stone-400)" }}
                        >
                          {formatDate(post.publishedAt)}
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
                        {excerpt && (
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--color-stone-500)" }}
                          >
                            {excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          {post.author && (
                            <div
                              className="text-xs font-medium"
                              style={{ color: "var(--color-stone-400)" }}
                            >
                              By {post.author}
                            </div>
                          )}
                          <Link
                            href={`/blog/${post.slug}`}
                            className="flex items-center gap-1 text-xs font-semibold transition-colors hover:gap-2 ml-auto"
                            style={{ color: "var(--color-forest-600)" }}
                          >
                            Read More
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
