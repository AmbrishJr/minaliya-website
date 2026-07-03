"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2, Leaf, Upload, Trash2, Edit } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/adminData";
import { slugify } from "@/lib/product-utils";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AddProductModalProps {
  categories: CategoryOption[];
  product?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    description: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    stock: number;
    images: string[];
    imagePublicIds: (string | undefined)[];
  };
  triggerButton?: React.ReactNode;
  onSuccess?: () => void;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border border-stone-200 bg-white text-stone-800 focus:border-forest-400 focus:ring-2 focus:ring-forest-50";

interface ImageItem {
  url: string;
  publicId?: string;
  file?: File;
}

export default function AddProductModal({ categories, product, triggerButton, onSuccess }: AddProductModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(!!product);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Custom representation of images: { url: string; publicId?: string; file?: File }
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    if (product) {
      setName(product.name ?? "");
      setSlug(product.slug ?? "");
      setSlugTouched(true);
      setCategoryId(product.categoryId ?? (categories[0]?.id ?? ""));
      setDescription(product.description ?? "");
      setPrice(product.price != null ? String(product.price) : "");
      setDiscountPrice(product.discountPrice != null ? String(product.discountPrice) : "");
      setIsFeatured(product.isFeatured ?? false);
      // Map existing images with their public_ids
      const existingImages: ImageItem[] = (product.images ?? []).map((img: string, i: number) => ({
        url: img,
        publicId: product.imagePublicIds?.[i] ?? undefined,
      }));
      setImages(existingImages);
    } else {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setCategoryId(categories[0]?.id ?? "");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setIsFeatured(false);
      setImages([]);
    }
    setError("");
  }, [product, categories]);

  // Sync state on open/reset
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetForm();
    }
  }, [open, resetForm]);

  const handleNameBlur = () => {
    if (!slugTouched && name.trim()) {
      setSlug(slugify(name));
    }
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files?.length) return;

    const newFiles = Array.from(files);
    const total = images.length + newFiles.length;

    if (total > 4) {
      setError("You can upload a maximum of 4 images.");
      return;
    }

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, { url: e.target?.result as string, file }]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
  }, [images.length]);

  const removeImage = async (index: number) => {
    const img = images[index];

    // If this is an already-uploaded Cloudinary image, delete it from Cloudinary
    if (img.publicId && !img.file) {
      try {
        await fetch("/api/admin/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: img.publicId }),
        });
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadNewImages = async (): Promise<{ urls: string[]; publicIds: string[] } | null> => {
    const newFiles = images.filter((img) => img.file).map((img) => img.file as File);
    if (newFiles.length === 0) return { urls: [], publicIds: [] };

    setUploading(true);
    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { urls, publicIds } = await res.json();
      return { urls, publicIds };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!images.length) {
      setError("Please select at least one product image.");
      return;
    }

    setLoading(true);

    const uploadResult = await uploadNewImages();
    if (!uploadResult) {
      setLoading(false);
      return;
    }

    // Build final arrays by mapping each image to its final URL and publicId
    let newUrlIndex = 0;
    const finalImages: string[] = [];
    const finalPublicIds: string[] = [];

    for (const img of images) {
      if (img.file) {
        // This was a newly uploaded file
        finalImages.push(uploadResult.urls[newUrlIndex]);
        finalPublicIds.push(uploadResult.publicIds[newUrlIndex]);
        newUrlIndex++;
      } else {
        // This is an existing image
        finalImages.push(img.url);
        finalPublicIds.push(img.publicId ?? "");
      }
    }

    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        description,
        categoryId,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: product?.stock ?? 100,
        images: finalImages,
        imagePublicIds: finalPublicIds,
        isFeatured,
      };

      let result;
      if (product) {
        result = await updateProduct(product.id, payload);
      } else {
        result = await createProduct(payload);
      }

      if (result.success) {
        setOpen(false);
        resetForm();
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        setError(result.error || `Failed to ${product ? "update" : "create"} product.`);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {triggerButton}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl shadow-sm"
          disabled={categories.length === 0}
        >
          <Plus size={18} />
          Add Product
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !loading && !uploading && setOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-2xl rounded-3xl border shadow-2xl"
              style={{
                background: "white",
                borderColor: "var(--color-stone-200)",
              }}
            >
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-3xl"
                style={{ borderColor: "var(--color-stone-200)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "var(--color-forest-50)",
                      color: "var(--color-forest-600)",
                    }}
                  >
                    <Leaf size={20} />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-bold text-stone-900"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {product ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-xs text-stone-500">
                      {product ? "Update database records" : "Saved to database and visible on the shop page"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !loading && !uploading && setOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {categories.length === 0 && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    No categories in the database. Run the Prisma seed script first.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={handleNameBlur}
                      className={inputClass}
                      placeholder="Cold Pressed Groundnut Oil (1 Ltr)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Slug *
                    </label>
                    <input
                      required
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value);
                      }}
                      className={`${inputClass} font-mono text-xs`}
                      placeholder="groundnut-oil-1ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Category *
                    </label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className={inputClass}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputClass}
                    placeholder="Short product description for the shop page"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Price (₹) *
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={inputClass}
                      placeholder="449"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      className={inputClass}
                      placeholder="349"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Product Images * (1-4 images)
                  </label>

                  {/* Drop zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:bg-stone-50/50"
                    style={{
                      borderColor: "var(--color-stone-300)",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: "var(--color-forest-50)",
                          color: "var(--color-forest-600)",
                        }}
                      >
                        <Upload size={22} />
                      </div>
                      <p className="text-sm font-medium text-stone-600">
                        Drop images here or click to browse
                      </p>
                      <p className="text-xs text-stone-400">
                        PNG, JPG, WebP (max 4 images)
                      </p>
                    </div>
                  </div>

                  {/* Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50"
                        >
                          <img
                            src={img.url}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-forest-600 text-white">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}

                      {images.length < 4 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 transition-colors"
                        >
                          <Plus size={24} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-stone-300 text-forest-600 focus:ring-forest-500"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    Featured product (shows badge on shop)
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    disabled={loading || uploading}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading || categories.length === 0}
                    className="flex-1 btn-primary justify-center py-3 rounded-xl disabled:opacity-70"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {uploading ? "Uploading..." : product ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {product ? <Edit size={18} /> : <Plus size={18} />}
                        {product ? "Save Changes" : "Create Product"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
