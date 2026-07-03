import { getAllBlogs } from "@/lib/blog";
import BlogClient from "@/components/admin/BlogClient";

export const revalidate = 0;

export default async function AdminBlogPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Blog Posts
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Create and manage blog posts — write articles, upload images, and publish.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm whitespace-nowrap">
            {blogs.length} Posts
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
        <BlogClient blogs={blogs} />
      </div>
    </div>
  );
}
