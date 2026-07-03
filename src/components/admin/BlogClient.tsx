"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  Upload,
  Loader2,
  X,
  GripVertical,
} from "lucide-react";
import { createBlog, updateBlog, deleteBlog, type ContentBlock } from "@/actions/adminData";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: ContentBlock[];
  images: string[];
  imagePublicIds: string[];
  author: string | null;
  publishedAt: string;
  createdAt: string;
}

interface Props {
  blogs: BlogPost[];
}

const emptyContent: ContentBlock[] = [
  { type: "lead", text: "" },
];

export default function BlogClient({ blogs: initialBlogs }: Props) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: emptyContent.map((c) => ({ ...c })),
    images: [] as string[],
    imagePublicIds: [] as string[],
    author: "",
  });

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      content: emptyContent.map((c) => ({ ...c })),
      images: [],
      imagePublicIds: [],
      author: "",
    });
    setImagePreviews([]);
    setImageFiles([]);
    setError("");
  }

  function openCreate() {
    resetForm();
    setEditing(null);
    setIsCreating(true);
  }

  function openEdit(blog: BlogPost) {
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content.map((c) => ({ ...c })),
      images: blog.images,
      imagePublicIds: blog.imagePublicIds,
      author: blog.author ?? "",
    });
    setImagePreviews(blog.images);
    setImageFiles([]);
    setEditing(blog);
    setIsCreating(false);
    setError("");
  }

  function closePanel() {
    setIsCreating(false);
    setEditing(null);
    resetForm();
  }

  function addContentBlock() {
    setForm({ ...form, content: [...form.content, { type: "p", text: "" }] });
  }

  function updateContentBlock(index: number, field: string, value: string | string[]) {
    const content = [...form.content];
    (content[index] as Record<string, unknown>)[field] = value;
    setForm({ ...form, content });
  }

  function removeContentBlock(index: number) {
    const content = form.content.filter((_, i) => i !== index);
    setForm({ ...form, content: content.length ? content : emptyContent });
  }

  function moveBlock(index: number, direction: "up" | "down") {
    const content = [...form.content];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= content.length) return;
    [content[index], content[swapIdx]] = [content[swapIdx], content[index]];
    setForm({ ...form, content });
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePublicIds: prev.imagePublicIds.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const title = form.title.trim();
    const slug = form.slug.trim() || form.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const content = form.content.filter((c) => c.text?.trim() || c.items?.length);

    if (!title) { setError("Title is required."); setSaving(false); return; }
    if (!content.length) { setError("At least one content block is required."); setSaving(false); return; }

    let images = [...form.images];
    let imagePublicIds = [...form.imagePublicIds];

    // Upload new image files
    if (imageFiles.length) {
      setUploading(true);
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("images", file);
        try {
          const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
          }
          const { urls, publicIds } = await res.json();
          images.push(urls[0]);
          imagePublicIds.push(publicIds[0]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to upload image.");
          setSaving(false);
          setUploading(false);
          return;
        }
      }
      setUploading(false);
    }

    if (!images.length) { setError("At least one image is required."); setSaving(false); return; }

    try {
      if (editing) {
        const res = await updateBlog(editing.id, {
          title,
          slug,
          content,
          images,
          imagePublicIds,
          author: form.author || undefined,
        });
        if (!res.success) { setError(res.error); return; }
      } else {
        const res = await createBlog({
          title,
          slug,
          content,
          images,
          imagePublicIds,
          author: form.author || undefined,
        });
        if (!res.success) { setError(res.error); return; }
      }
      closePanel();
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog post? This action cannot be undone.")) return;
    const res = await deleteBlog(id);
    if (res.success) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    } else {
      setError(res.error);
    }
  }

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

  const isPanelOpen = isCreating || editing;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-stone-700">All Posts</h3>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "var(--color-forest-600)", color: "white" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-forest-700)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-forest-600)"; }}
        >
          <Plus size={14} />
          New Post
        </button>
      </div>

      {/* Blog list */}
      {blogs.length === 0 ? (
        <div className="text-center py-12 text-stone-400 text-sm">
          No blog posts yet. Click &quot;New Post&quot; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center gap-4 p-4 rounded-xl border transition-all"
              style={{
                borderColor: "var(--color-stone-200)",
                background: "white",
              }}
            >
              {/* Thumb */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: "var(--color-stone-200)" }}>
                {blog.images[0] ? (
                  <Image src={blog.images[0]} alt={blog.title} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">No img</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{blog.title}</p>
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  {formatDate(blog.publishedAt)} {blog.author ? `· ${blog.author}` : ""}
                </p>
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  {blog.content.find((c) => c.text)?.text ? stripHtml(blog.content.find((c) => c.text)!.text!).slice(0, 100) : ""}...
                </p>
              </div>

              {/* Images count */}
              <div className="text-xs text-stone-400 shrink-0">
                {blog.images.length} img
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(blog)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-stone-100"
                  title="Edit"
                >
                  <Edit3 size={15} className="text-stone-400" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Editor Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closePanel} />
          <div
            className="relative z-10 w-full max-w-3xl rounded-2xl border shadow-xl overflow-y-auto max-h-[90vh]"
            style={{ background: "white", borderColor: "var(--color-stone-200)" }}
          >
            <div className="p-6 border-b sticky top-0 z-20" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900">
                  {editing ? "Edit Post" : "New Post"}
                </h3>
                <button onClick={closePanel} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="e.g. Benefits of Cold Pressed Groundnut Oil"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="auto-generated from title"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="e.g. Minaliya Team"
                />
              </div>

              {/* Content Blocks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-stone-600">Content Blocks *</label>
                  <button
                    onClick={addContentBlock}
                    className="text-xs font-semibold text-forest-600 hover:text-forest-700"
                  >
                    + Add Block
                  </button>
                </div>
                <div className="space-y-3">
                  {form.content.map((block, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border"
                      style={{ borderColor: "var(--color-stone-200)", background: "var(--color-stone-50)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex flex-col gap-0.5 text-stone-300">
                          <button
                            onClick={() => moveBlock(i, "up")}
                            disabled={i === 0}
                            className="disabled:opacity-20 hover:text-stone-500 leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveBlock(i, "down")}
                            disabled={i === form.content.length - 1}
                            className="disabled:opacity-20 hover:text-stone-500 leading-none"
                          >
                            ▼
                          </button>
                        </div>
                        <select
                          value={block.type}
                          onChange={(e) => updateContentBlock(i, "type", e.target.value)}
                          className="px-2 py-1.5 rounded-lg border text-xs font-semibold"
                          style={{ borderColor: "var(--color-stone-200)" }}
                        >
                          <option value="lead">Lead</option>
                          <option value="h2">Heading</option>
                          <option value="p">Paragraph</option>
                          <option value="blockquote">Quote</option>
                          <option value="cta">CTA</option>
                          <option value="ul">List</option>
                        </select>
                        <button
                          onClick={() => removeContentBlock(i)}
                          className="p-1 rounded-lg hover:bg-red-50 text-red-400 shrink-0 ml-auto"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {block.type === "ul" ? (
                        <ListEditor
                          items={block.items || []}
                          onChange={(items) => updateContentBlock(i, "items", items)}
                        />
                      ) : (
                        <textarea
                          value={block.text || ""}
                          onChange={(e) => updateContentBlock(i, "text", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                          style={{ borderColor: "var(--color-stone-200)" }}
                          rows={block.type === "lead" ? 3 : 3}
                          placeholder={`Enter ${block.type} content...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Images * (PNG, JPG, WebP)
                </label>

                {/* Image grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-stone-200)" }}>
                      <Image src={preview} alt={`Image ${i + 1}`} fill className="object-cover" sizes="150px" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-stone-800/70 text-white hover:bg-stone-800"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors hover:bg-stone-50/50"
                  style={{ borderColor: "var(--color-stone-300)" }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-600)" }}>
                      <Upload size={16} />
                    </div>
                    <p className="text-xs font-medium text-stone-600">Click to add images</p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "var(--color-terra-50)", color: "var(--color-terra-600)" }}
                >
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: "var(--color-stone-200)" }}>
                <button
                  onClick={closePanel}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={{ borderColor: "var(--color-stone-200)", color: "var(--color-stone-600)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50 inline-flex items-center gap-2"
                  style={{ background: "var(--color-forest-600)" }}
                  onMouseEnter={(e) => { if (!saving && !uploading) e.currentTarget.style.background = "var(--color-forest-700)"; }}
                  onMouseLeave={(e) => { if (!saving && !uploading) e.currentTarget.style.background = "var(--color-forest-600)"; }}
                >
                  {uploading ? (
                    <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                  ) : saving ? (
                    <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  ) : editing ? (
                    "Update Post"
                  ) : (
                    "Create Post"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// List Editor sub-component
function ListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  function addItem() {
    onChange([...items, ""]);
  }

  function updateItem(index: number, value: string) {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-stone-400">•</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border text-sm"
            style={{ borderColor: "var(--color-stone-200)" }}
            placeholder="List item..."
          />
          <button onClick={() => removeItem(i)} className="p-0.5 text-red-400 hover:text-red-600">
            <X size={12} />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="text-xs font-semibold text-forest-600 hover:text-forest-700">
        + Add Item
      </button>
    </div>
  );
}
