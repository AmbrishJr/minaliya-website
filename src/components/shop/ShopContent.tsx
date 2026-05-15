"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Eye, SlidersHorizontal } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { allProducts, Product } from "@/data/products";


const categories = ["All", "Groundnut", "Coconut", "Sesame"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

/* ═══════════════════════════════════════════
   PRODUCT CARD
   ═══════════════════════════════════════════ */

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.slug);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Link href={`/shop/${product.slug}`} className="block">
      <article className="product-card group relative">
        {/* Image */}
        <div className="product-image relative aspect-[3/4] p-6 flex items-center justify-center">
          <Image
            src={product.image}
            alt={`${product.name} - Minaliya Mara Chekku Wood Pressed Oil`}
            width={280}
            height={380}
            className="object-contain max-h-full w-auto"
            loading="lazy"
            quality={85}
          />

          {/* Badge */}
          {product.badge && (
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background:
                  product.badge === "Bestseller"
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
              className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: "var(--color-terra-100)",
                color: "var(--color-terra-500)",
              }}
            >
              -{discount}%
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors"
              style={{ 
                background: "white", 
                color: isWishlisted ? "var(--color-terra-500)" : "var(--color-stone-600)" 
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
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors"
              style={{ background: "white", color: "var(--color-stone-600)" }}
              aria-label="Quick view"
              onClick={(e) => e.preventDefault()}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.floor(product.rating) ? "var(--color-amber-400)" : "none"}
                  stroke={
                    i < Math.floor(product.rating)
                      ? "var(--color-amber-400)"
                      : "var(--color-stone-300)"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--color-stone-400)" }}>
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Name */}
          <h3
            className="text-base font-semibold leading-snug"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-stone-800)",
            }}
          >
            {product.name}
          </h3>

          {/* Sizes */}
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
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
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold" style={{ color: "var(--color-stone-800)" }}>
                ₹{product.price}
              </span>
              <span className="text-sm line-through" style={{ color: "var(--color-stone-400)" }}>
                ₹{product.originalPrice}
              </span>
            </div>
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all hover:shadow-md"
              style={{ background: "var(--color-forest-600)", color: "white" }}
              aria-label={`Add ${product.name} to cart`}
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  size: product.sizes[product.sizes.length - 1],
                });
              }}
            >
              <ShoppingBag size={14} />
              Add
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ═══════════════════════════════════════════
   SHOP CONTENT
   ═══════════════════════════════════════════ */

export default function ShopContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews;
    }
  });

  return (
    <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background:
                    activeCategory === cat ? "var(--color-forest-600)" : "white",
                  color:
                    activeCategory === cat ? "white" : "var(--color-stone-600)",
                  border: `1px solid ${
                    activeCategory === cat
                      ? "var(--color-forest-600)"
                      : "var(--color-stone-200)"
                  }`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} style={{ color: "var(--color-stone-400)" }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-medium outline-none cursor-pointer px-3 py-2 rounded-lg border"
              style={{
                background: "white",
                color: "var(--color-stone-700)",
                borderColor: "var(--color-stone-200)",
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm mb-6" style={{ color: "var(--color-stone-400)" }}>
          Showing {sorted.length} {sorted.length === 1 ? "product" : "products"}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
