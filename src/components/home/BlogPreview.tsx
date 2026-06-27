import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getAllBlogs } from "@/lib/blog";

function getExcerpt(blog: { content: { type: string; text?: string; items?: string[] }[] }): string {
  const firstTextBlock = blog.content.find((c) => c.text);
  if (!firstTextBlock?.text) return "";
  const cleaned = firstTextBlock.text.replace(/<[^>]*>/g, "");
  return cleaned.length > 150 ? cleaned.slice(0, 150) + "..." : cleaned;
}

export default async function BlogPreview() {
  const allPosts = await getAllBlogs();
  const posts = allPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-3">
            <div className="divider-leaf" />
            <h2 className="section-title">From Our Journal</h2>
            <p
              className="text-base max-w-md"
              style={{ color: "var(--color-stone-500)" }}
            >
              Insights on traditional oils, healthy cooking, and wellness
              from the Minaliya team.
            </p>
          </div>
          <Link
            href="/blog"
            className="btn-secondary text-sm shrink-0 w-full sm:w-auto justify-center"
          >
            View All Articles
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "var(--color-cream-200)" }}>
              <Clock size={20} style={{ color: "var(--color-stone-400)" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>
              No articles yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const excerpt = getExcerpt(post);
              return (
                <article
                  key={post.id}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: "var(--color-cream-50)",
                    border: "1px solid var(--color-stone-200)",
                  }}
                >
                  {/* Featured Image */}
                  <div className="h-48 relative overflow-hidden">
                    {post.images[0] ? (
                      <Image
                        src={post.images[0]}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: "linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-cream-200) 100%)" }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3
                      className="text-lg font-semibold leading-snug group-hover:underline decoration-1 underline-offset-4"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-stone-800)",
                      }}
                    >
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {excerpt && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-stone-500)" }}
                      >
                        {excerpt}
                      </p>
                    )}
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium pt-1"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      <Clock size={13} />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
