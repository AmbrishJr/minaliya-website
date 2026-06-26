"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface FeaturedProduct {
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  sizes: string[];
  category: string;
  description: string;
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [qty, setQty] = useState(0);
  const [toast, setToast] = useState(false);
  const isWishlisted = isInWishlist(product.slug);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Link href={`/shop/${product.slug}`} className="block relative">
    <article className="product-card group relative">
      {/* Image */}
      <div className="product-image relative w-full aspect-[4/3]">
        <Image
          src={product.image}
          alt={`${product.name} - Minaliya Mara Chekku Wood Pressed Oil`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
          quality={85}
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-1 left-1 px-1 py-0.5 rounded-full text-[7px] font-semibold"
            style={{
              background: product.badge === "Bestseller"
                ? "var(--color-forest-600)"
                : product.badge === "Popular"
                  ? "var(--color-amber-500)"
                  : "var(--color-terra-400)",
              color: "white",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span
            className="absolute top-1 right-1 px-1 py-0.5 rounded-full text-[7px] font-bold"
            style={{
              background: "var(--color-terra-100)",
              color: "var(--color-terra-500)",
            }}
          >
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="touch-action-show absolute right-1 bottom-1 flex flex-col gap-1 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors"
            style={{
              background: "white",
              color: isWishlisted ? "var(--color-terra-500)" : "var(--color-stone-600)",
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist({
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                originalPrice: product.originalPrice,
              });
            }}
          >
            <Heart size={11} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors"
            style={{
              background: "white",
              color: "var(--color-stone-600)",
            }}
            aria-label="Quick view"
          >
            <Eye size={11} />
          </button>
        </div>
      </div>

        {/* Content */}
        <div className="p-1 space-y-0.5">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={8}
                fill={i < Math.floor(product.rating) ? "var(--color-amber-400)" : "none"}
                stroke={i < Math.floor(product.rating) ? "var(--color-amber-400)" : "var(--color-stone-300)"}
              />
            ))}
          </div>
          <span className="text-[8px] font-medium" style={{ color: "var(--color-stone-400)" }}>
            {product.rating}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-[10px] sm:text-xs font-semibold leading-snug line-clamp-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-stone-800)",
          }}
        >
          {product.name}
        </h3>

        {/* Sizes */}
        <div className="flex flex-wrap gap-0.5">
          {product.sizes.map((size) => (
            <span
              key={size}
              className="text-[8px] px-1 py-0.5 rounded-full font-medium"
              style={{
                background: "var(--color-cream-100)",
                color: "var(--color-stone-600)",
              }}
            >
              {size}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex flex-row items-center justify-between gap-1">
          <div className="flex items-baseline gap-0.5">
            <span
              className="text-[11px] sm:text-xs font-bold"
              style={{ color: "var(--color-stone-800)" }}
            >
              ₹{product.price}
            </span>
            <span
              className="text-[8px] sm:text-[9px] line-through"
              style={{ color: "var(--color-stone-400)" }}
            >
              ₹{product.originalPrice}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="flex items-center border rounded-full overflow-hidden shrink-0" style={{ borderColor: "var(--color-stone-200)" }}>
              <button
                className="w-5 h-5 flex items-center justify-center text-[9px] font-semibold transition-colors hover:bg-stone-100 cursor-pointer"
                style={{ color: qty <= 0 ? "var(--color-stone-300)" : "var(--color-stone-600)" }}
                disabled={qty <= 0}
                onClick={(e) => { e.preventDefault(); setQty(Math.max(0, qty - 1)); }}
              >
                −
              </button>
              <span className="w-5 h-5 flex items-center justify-center text-[8px] font-semibold select-none" style={{ color: "var(--color-stone-700)" }}>
                {qty}
              </span>
              <button
                className="w-5 h-5 flex items-center justify-center text-[9px] font-semibold transition-colors hover:bg-stone-100 cursor-pointer"
                style={{ color: "var(--color-stone-600)" }}
                onClick={(e) => { e.preventDefault(); setQty(qty + 1); }}
              >
                +
              </button>
            </div>
            <button
              className="flex items-center justify-center gap-0.5 px-1.5 py-1 rounded-full text-[8px] font-semibold transition-all hover:shadow-md whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: qty === 0 ? "var(--color-stone-400)" : "var(--color-forest-600)",
                color: "white",
              }}
              disabled={qty === 0}
              aria-label={`Add ${product.name} to cart`}
              onClick={(e) => {
                e.preventDefault();
                if (qty === 0) return;
                for (let i = 0; i < qty; i++) {
                  addItem({
                    slug: product.slug,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    size: product.sizes[0],
                  }, 1, false);
                }
                setQty(0);
                setToast(true);
                setTimeout(() => setToast(false), 2000);
              }}
            >
              <ShoppingBag size={10} />
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
    {toast && (
      <div
        className="absolute top-1 left-1/2 -translate-x-1/2 z-20 px-2 py-1 rounded-full text-[10px] font-semibold shadow-lg animate-fade-in-up"
        style={{
          background: "var(--color-forest-600)",
          color: "white",
        }}
      >
        Added
      </div>
    )}
    </Link>
  );
}

export default function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  // Group products by category preserving display order
  const grouped: { category: string; items: FeaturedProduct[] }[] = [];
  const seen = new Set<string>();
  products.forEach((p) => {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      grouped.push({ category: p.category, items: [p] });
    } else {
      const group = grouped.find((g) => g.category === p.category);
      if (group) group.items.push(p);
    }
  });

  return (
    <section
      id="products"
      className="section-padding"
      style={{ background: "var(--color-cream-50)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">Our Pure Cold Pressed Oils</h2>
          <p className="section-subtitle mx-auto">
            Handpicked seeds, traditional wooden press extraction, and fresh
            bottling — experience the authentic taste of purity.
          </p>
        </div>

        {/* Product Grid — 2 columns, rows grouped by category */}
        <div className="space-y-2">
          {grouped.map((group) => (
            <div key={group.category} className="grid grid-cols-2 gap-2">
              {group.items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-6">
          <Link href="/shop" className="btn-secondary px-10 inline-flex">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
