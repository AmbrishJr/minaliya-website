"use client";

import { useWishlist } from "@/context/WishlistContext";
import { HeartOff, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WishlistClient() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <section className="flex-1 flex items-center justify-center py-20" style={{ background: "var(--color-cream-50)" }}>
        <div className="text-center px-4">
           <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "var(--color-cream-100)",
                color: "var(--color-stone-300)",
              }}
            >
              <HeartOff size={40} />
            </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-stone-900)",
            }}
          >
            Your Wishlist is Empty
          </h1>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--color-stone-500)" }}>
            Looks like you haven&apos;t saved any products yet. Explore our collection of pure cold pressed oils and save your favorites here.
          </p>
          <Link href="/shop" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 py-16" style={{ background: "var(--color-cream-50)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="divider-leaf mx-auto" />
          <h1 className="section-title">Your Wishlist</h1>
          <p className="section-subtitle mx-auto">
            {items.length} {items.length === 1 ? "Product" : "Products"} Saved
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <article key={product.slug} className="product-card group relative flex flex-col">
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="product-image relative aspect-[3/4] p-6 flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={280}
                    height={380}
                    className="object-contain max-h-full w-auto"
                  />
                  
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                    style={{
                      background: "white",
                      color: "var(--color-terra-500)",
                    }}
                    aria-label="Remove from wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(product.slug);
                    }}
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              </Link>

              <div className="p-5 flex-1 flex flex-col">
                <Link href={`/shop/${product.slug}`} className="block">
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-stone-800)",
                    }}
                  >
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-baseline gap-2 mt-auto mb-4">
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--color-stone-800)" }}
                  >
                    ₹{product.price}
                  </span>
                  <span
                    className="text-sm line-through"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    ₹{product.originalPrice}
                  </span>
                </div>

                <Link
                  href={`/shop/${product.slug}`}
                  className="btn-primary w-full justify-center mt-auto"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
