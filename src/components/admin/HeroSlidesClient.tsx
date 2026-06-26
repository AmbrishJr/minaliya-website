"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { createHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides } from "@/actions/adminData";

type HeadlinePart = { text: string; style: "display" | "serif-italic" | "sans" };

interface Slide {
  id: string;
  label: string;
  headline: HeadlinePart[];
  subtitle: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  badge: string | null;
  bgPrimary: string;
  bgSecondary: string;
  bgAccent: string;
  sortOrder: number;
  isActive: boolean;
}

interface Props {
  slides: Slide[];
}

const emptyHeadline: HeadlinePart[] = [
  { text: "", style: "sans" },
  { text: "", style: "serif-italic" },
  { text: "", style: "sans" },
  { text: "", style: "display" },
];

export default function HeroSlidesClient({ slides: initialSlides }: Props) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    label: "",
    headlineParts: emptyHeadline.map((h) => ({ ...h })),
    subtitle: "",
    image: "/products/placeholder.jpg",
    imageAlt: "",
    accentColor: "#C47700",
    badge: "",
    bgPrimary: "#FFFFFF",
    bgSecondary: "#F9F9F9",
    bgAccent: "#FFFFFF",
    isActive: true,
  });

  function resetForm() {
    setForm({
      label: "",
      headlineParts: emptyHeadline.map((h) => ({ ...h })),
      subtitle: "",
      image: "/products/placeholder.jpg",
      imageAlt: "",
      accentColor: "#C47700",
      badge: "",
      bgPrimary: "#FFFFFF",
      bgSecondary: "#F9F9F9",
      bgAccent: "#FFFFFF",
      isActive: true,
    });
    setImagePreview(null);
    setImageFile(null);
    setError("");
  }

  function openCreate() {
    resetForm();
    setEditing(null);
    setIsCreating(true);
  }

  function openEdit(slide: Slide) {
    setForm({
      label: slide.label,
      headlineParts: slide.headline.map((h) => ({ ...h })),
      subtitle: slide.subtitle,
      image: slide.image,
      imageAlt: slide.imageAlt,
      accentColor: slide.accentColor,
      badge: slide.badge ?? "",
      bgPrimary: slide.bgPrimary,
      bgSecondary: slide.bgSecondary,
      bgAccent: slide.bgAccent,
      isActive: slide.isActive,
    });
    setImagePreview(slide.image);
    setImageFile(null);
    setEditing(slide);
    setIsCreating(false);
    setError("");
  }

  function closePanel() {
    setIsCreating(false);
    setEditing(null);
    resetForm();
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  function updateHeadline(index: number, field: keyof HeadlinePart, value: string) {
    const parts = [...form.headlineParts];
    (parts[index] as any)[field] = value;
    setForm({ ...form, headlineParts: parts });
  }

  function addHeadlinePart() {
    setForm({ ...form, headlineParts: [...form.headlineParts, { text: "", style: "sans" }] });
  }

  function removeHeadlinePart(index: number) {
    const parts = form.headlineParts.filter((_, i) => i !== index);
    setForm({ ...form, headlineParts: parts.length ? parts : emptyHeadline });
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { urls } = await res.json();
      return urls[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const headline = form.headlineParts.filter((p) => p.text.trim());

    if (!form.label.trim()) { setError("Label is required."); setSaving(false); return; }
    if (!headline.length) { setError("At least one headline part is required."); setSaving(false); return; }
    if (!form.subtitle.trim()) { setError("Subtitle is required."); setSaving(false); return; }

    let imageUrl = form.image;

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) { setSaving(false); return; }
      imageUrl = uploadedUrl;
    }

    try {
      if (editing) {
        const res = await updateHeroSlide(editing.id, {
          label: form.label,
          headline,
          subtitle: form.subtitle,
          image: imageUrl,
          imageAlt: form.imageAlt,
          accentColor: form.accentColor,
          badge: form.badge || undefined,
          bgPrimary: form.bgPrimary,
          bgSecondary: form.bgSecondary,
          bgAccent: form.bgAccent,
          isActive: form.isActive,
        });
        if (!res.success) { setError(res.error); return; }
      } else {
        const res = await createHeroSlide({
          label: form.label,
          headline,
          subtitle: form.subtitle,
          image: imageUrl,
          imageAlt: form.imageAlt,
          accentColor: form.accentColor,
          badge: form.badge || undefined,
          bgPrimary: form.bgPrimary,
          bgSecondary: form.bgSecondary,
          bgAccent: form.bgAccent,
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
    if (!confirm("Delete this hero slide?")) return;
    const res = await deleteHeroSlide(id);
    if (res.success) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } else {
      setError(res.error);
    }
  }

  async function handleToggleActive(slide: Slide) {
    const res = await updateHeroSlide(slide.id, { isActive: !slide.isActive });
    if (res.success) {
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s))
      );
      router.refresh();
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = slides.findIndex((s) => s.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === slides.length - 1) return;

    const newSlides = [...slides];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]];
    setSlides(newSlides);

    await reorderHeroSlides(newSlides.map((s) => s.id));
    router.refresh();
  }

  const isPanelOpen = isCreating || editing;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-stone-700">All Slides</h3>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "var(--color-forest-600)", color: "white" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-forest-700)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-forest-600)"; }}
        >
          <Plus size={14} />
          Add Slide
        </button>
      </div>

      {/* Slides list */}
      {slides.length === 0 ? (
        <div className="text-center py-12 text-stone-400 text-sm">
          No hero slides yet. Click &quot;Add Slide&quot; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className="flex items-center gap-4 p-4 rounded-xl border transition-all"
              style={{
                borderColor: "var(--color-stone-200)",
                background: slide.isActive ? "white" : "var(--color-stone-50)",
                opacity: slide.isActive ? 1 : 0.6,
              }}
            >
              {/* Drag handle */}
              <div className="flex flex-col gap-0.5 text-stone-300">
                <button
                  onClick={() => handleMove(slide.id, "up")}
                  disabled={idx === 0}
                  className="disabled:opacity-20 hover:text-stone-500"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => handleMove(slide.id, "down")}
                  disabled={idx === slides.length - 1}
                  className="disabled:opacity-20 hover:text-stone-500"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Thumb */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: "var(--color-stone-200)" }}>
                <Image src={slide.image} alt={slide.imageAlt} fill className="object-contain p-1" sizes="56px" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{slide.label}</p>
                <p className="text-xs text-stone-400 truncate mt-0.5">{slide.subtitle}</p>
              </div>

              {/* Badge color indicator */}
              <div
                className="w-5 h-5 rounded-full shrink-0 border"
                style={{ background: slide.accentColor, borderColor: "var(--color-stone-200)" }}
                title={`Accent: ${slide.accentColor}`}
              />

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleActive(slide)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-stone-100"
                  title={slide.isActive ? "Deactivate" : "Activate"}
                >
                  {slide.isActive ? <Eye size={15} className="text-stone-400" /> : <EyeOff size={15} className="text-stone-300" />}
                </button>
                <button
                  onClick={() => openEdit(slide)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-stone-100"
                  title="Edit"
                >
                  <Edit3 size={15} className="text-stone-400" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
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

      {/* Slide Editor Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closePanel} />
          <div
            className="relative z-10 w-full max-w-2xl rounded-2xl border shadow-xl overflow-y-auto max-h-[90vh]"
            style={{ background: "white", borderColor: "var(--color-stone-200)" }}
          >
            <div className="p-6 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900">
                  {editing ? "Edit Slide" : "New Slide"}
                </h3>
                <button onClick={closePanel} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder='e.g. "Tradition Crafted Since Generations"'
                />
              </div>

              {/* Headline Parts */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Headline Parts</label>
                <div className="space-y-2">
                  {form.headlineParts.map((part, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={part.text}
                        onChange={(e) => updateHeadline(i, "text", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                        style={{ borderColor: "var(--color-stone-200)" }}
                        placeholder="Headline text"
                      />
                      <select
                        value={part.style}
                        onChange={(e) => updateHeadline(i, "style", e.target.value)}
                        className="px-2 py-2 rounded-lg border text-xs"
                        style={{ borderColor: "var(--color-stone-200)" }}
                      >
                        <option value="sans">Sans</option>
                        <option value="serif-italic">Serif Italic</option>
                        <option value="display">Display</option>
                      </select>
                      <button
                        onClick={() => removeHeadlinePart(i)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 shrink-0"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addHeadlinePart}
                  className="mt-2 text-xs font-semibold text-forest-600 hover:text-forest-700"
                >
                  + Add Part
                </button>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Subtitle</label>
                <textarea
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  rows={2}
                  placeholder="Slide description subtitle"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Image * (PNG, JPG, WebP)
                </label>

                {/* Drop zone */}
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors hover:bg-stone-50/50"
                  style={{
                    borderColor: "var(--color-stone-300)",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  {imagePreview ? (
                    <div className="relative mx-auto max-w-[200px]">
                      <Image
                        src={imagePreview}
                        alt="Slide preview"
                        width={200}
                        height={150}
                        className="object-contain rounded-lg border"
                        style={{ borderColor: "var(--color-stone-200)", maxHeight: 150 }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                          if (editing) setImagePreview(editing.image);
                        }}
                        className="absolute -top-2 -right-2 p-0.5 rounded-full bg-stone-800 text-white hover:bg-stone-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: "var(--color-forest-50)",
                          color: "var(--color-forest-600)",
                        }}
                      >
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-medium text-stone-600">
                        Drop image here or click to browse
                      </p>
                      <p className="text-[11px] text-stone-400">
                        PNG, JPG, WebP supported
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Alt */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Image Alt Text</label>
                <input
                  type="text"
                  value={form.imageAlt}
                  onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder="Describe the image"
                />
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--color-stone-200)" }}
                  placeholder='e.g. "Bestseller · Groundnut Oil"'
                />
              </div>

              {/* Color Fields */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Colors</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "accentColor", label: "Accent" },
                    { key: "bgPrimary", label: "BG Primary" },
                    { key: "bgSecondary", label: "BG Secondary" },
                    { key: "bgAccent", label: "BG Accent" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-[10px] text-stone-500 mb-1">{label}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={(form as any)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-8 h-8 rounded border cursor-pointer"
                          style={{ borderColor: "var(--color-stone-200)" }}
                        />
                        <input
                          type="text"
                          value={(form as any)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="flex-1 px-2 py-1.5 rounded-lg border text-[10px]"
                          style={{ borderColor: "var(--color-stone-200)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="slide-active"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="slide-active" className="text-xs font-semibold text-stone-600">
                  Active (visible on homepage)
                </label>
              </div>

              {error && (
                <div
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "var(--color-terra-50)", color: "var(--color-terra-600)" }}
                >
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
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
                    "Update Slide"
                  ) : (
                    "Create Slide"
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
