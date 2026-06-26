"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, CheckCircle, Edit, Trash2, Loader2 } from "lucide-react";
import AddProductModal, { CategoryOption } from "./AddProductModal";
import { deleteProduct } from "@/actions/adminData";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  isFeatured: boolean;
  categoryName: string;
  images: string[];
  categoryId: string;
  description: string;
  imagePublicIds: (string | undefined)[];
}

interface ProductsTableClientProps {
  products: ProductItem[];
  categories: CategoryOption[];
}

export default function ProductsTableClient({ products, categories }: ProductsTableClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        color: "#fff1f2",
        text: "#be123c",
        border: "#fecdd3",
        icon: AlertTriangle,
      };
    }
    if (stock <= 10) {
      return {
        label: "Low Stock",
        color: "#fffbeb",
        text: "#b45309",
        border: "#fde68a",
        icon: AlertTriangle,
      };
    }
    return {
      label: "In Stock",
      color: "var(--color-forest-50)",
      text: "var(--color-forest-700)",
      border: "var(--color-forest-200)",
      icon: CheckCircle,
    };
  };

  const handleDelete = (id: string) => {
    setDeleteError(null);
    startTransition(async () => {
      try {
        const result = await deleteProduct(id);
        if (result.success) {
          setDeletingId(null);
          router.refresh();
        } else {
          setDeleteError(result.error || "Failed to delete product.");
        }
      } catch {
        setDeleteError("An unexpected error occurred while deleting.");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500">
          {products.length} product{products.length !== 1 && "s"} total
        </p>
        <AddProductModal categories={categories} onSuccess={() => router.refresh()} />
      </div>
      <div className="overflow-x-auto">
        {products.length > 0 ? (
          <table className="w-full text-left border-collapse text-sm min-w-[750px]">
            <thead>
              <tr
                className="border-b font-semibold"
                style={{
                  borderColor: "var(--color-forest-100)",
                  background: "var(--color-forest-50)",
                  color: "var(--color-forest-700)",
                }}
              >
                <th className="p-4 pl-6 text-xs uppercase tracking-wider">Product Info</th>
                <th className="p-4 text-xs uppercase tracking-wider">Slug</th>
                <th className="p-4 text-xs uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider">Stock Level</th>
                <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 pr-6 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
              {products.map((product) => {
                const status = getStockStatus(product.stock);
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-forest-50/30 text-stone-600 transition-colors border-b"
                    style={{ borderColor: "var(--color-stone-100)" }}
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-50 flex items-center justify-center shrink-0 border"
                          style={{ borderColor: "var(--color-forest-200)" }}
                        >
                          <Image
                            src={product.images[0] || "/logo.png"}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900 text-sm block">
                            {product.name}
                          </span>
                          {product.isFeatured && (
                            <span
                              className="inline-flex text-[9px] font-bold uppercase tracking-wider mt-1"
                              style={{ color: "var(--color-amber-600)" }}
                            >
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-stone-500 font-medium">{product.slug}</td>
                    <td className="p-4 font-medium">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: "var(--color-cream-100)",
                          color: "var(--color-stone-700)",
                        }}
                      >
                        {product.categoryName}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-stone-900">₹{product.price}</div>
                      {product.discountPrice && (
                        <div className="text-xs font-medium" style={{ color: "var(--color-forest-600)" }}>
                          Sale: ₹{product.discountPrice}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-stone-900">{product.stock} units</td>
                    <td className="p-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: status.color,
                          color: status.text,
                          borderColor: status.border,
                        }}
                      >
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <AddProductModal
                          categories={categories}
                          product={product}
                          triggerButton={
                            <button
                              type="button"
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-forest-600 hover:border-forest-200 hover:bg-forest-50 transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </button>
                          }
                        />

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeletingId(product.id);
                          }}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-stone-500 font-medium space-y-3">
            <p>No products yet.</p>
            <p className="text-sm text-stone-400">
              Use <strong className="text-stone-600">Add Product</strong> above to create your first listing—it will
              appear on the shop automatically.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !isPending && setDeletingId(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl border shadow-2xl p-6 bg-white space-y-4"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
                    Delete Product
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Are you sure you want to delete this product? This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              {deleteError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4.5 py-3">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deletingId)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
