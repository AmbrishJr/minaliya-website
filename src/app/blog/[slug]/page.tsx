import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, ArrowLeft, User } from "lucide-react";
import { getBlogBySlug, getAllBlogs } from "@/lib/blog";
import JsonLd from "@/components/seo/JsonLd";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await getAllBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  const leadContent = post.content.find((c) => c.type === "lead")?.text;
  const ogImage = post.images[0] || "/og-image.svg";
  return {
    title: post.title,
    description: leadContent?.slice(0, 160) || "",
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: leadContent?.slice(0, 160) || "",
      url: `https://minaliya.com/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const baseUrl = "https://minaliya.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: "Home", url: baseUrl },
          { name: "Journal", url: `${baseUrl}/blog` },
          { name: post.title, url: postUrl },
        ]}
        blogPosting={{
          title: post.title,
          description: (post.content.find((b) => b.type === "lead") as any)?.text || post.title,
          image: post.images[0] || `${baseUrl}/og-image.svg`,
          datePublished: post.publishedAt,
          author: post.author || "The Minaliya Team",
          url: postUrl,
        }}
      />
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <article className="py-12 sm:py-20" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:underline"
              style={{ color: "var(--color-stone-500)" }}
            >
              <ArrowLeft size={16} />
              Back to Journal
            </Link>

            <header className="space-y-6 mb-12">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium" style={{ color: "var(--color-stone-400)" }}>
                  {formatDate(post.publishedAt)}
                </span>
                {post.author && (
                  <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--color-stone-400)" }}>
                    <User size={14} />
                    {post.author}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-stone-900)",
                }}
              >
                {post.title}
              </h1>
            </header>

            {/* Image Gallery */}
            {post.images.length > 0 && (
              <div className={`grid gap-4 mb-12 ${post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
                {post.images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative rounded-2xl overflow-hidden border ${i === 0 && post.images.length > 1 ? "col-span-full sm:col-span-2 sm:row-span-2" : "aspect-[4/3]"}`}
                    style={{ borderColor: "var(--color-stone-200)" }}
                  >
                    <Image
                      src={img}
                      alt={`${post.title} - Image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes={i === 0 && post.images.length > 1 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 50vw"}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg prose-stone max-w-none space-y-6">
              {post.content.map((block, i) => {
                switch (block.type) {
                  case "lead":
                    return (
                      <p key={i} className="lead text-xl leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                        {block.text}
                      </p>
                    );
                  case "h2":
                    return (
                      <h2 key={i} className="text-2xl font-bold mt-10 mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}>
                        {block.text}
                      </h2>
                    );
                  case "p":
                    return (
                      <p key={i} className="leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                        {block.text}
                      </p>
                    );
                  case "blockquote":
                    return (
                      <div key={i} className="p-6 my-8 rounded-2xl" style={{ background: "var(--color-cream-100)", border: "1px solid var(--color-stone-200)" }}>
                        <p className="text-sm leading-relaxed font-medium italic" style={{ color: "var(--color-stone-600)" }}>
                          {block.text}
                        </p>
                      </div>
                    );
                  case "ul":
                    return (
                      <ul key={i} className="list-disc pl-6 space-y-2 leading-relaxed" style={{ color: "var(--color-stone-600)" }}>
                        {block.items?.map((item: string, j: number) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    );
                  case "cta":
                    return (
                      <p key={i} className="mt-8 leading-relaxed font-medium italic" style={{ color: "var(--color-stone-500)" }}>
                        {block.text}
                      </p>
                    );
                  default:
                    return null;
                }
              })}
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
                <div className="font-semibold" style={{ color: "var(--color-stone-800)" }}>
                  {post.author || "The Minaliya Team"}
                </div>
                <div className="text-sm" style={{ color: "var(--color-stone-500)" }}>
                  {post.author ? "Contributor" : "Passionate about traditional wellness and pure foods."}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
