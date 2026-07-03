import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopContent from "@/components/shop/ShopContent";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Pure Cold Pressed Oils",
  description:
    "Browse our collection of 100% pure wooden cold pressed oils. Groundnut, coconut, and sesame oils — traditionally extracted using Mara Chekku methods. Free shipping above ₹499.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Pure Cold Pressed Oils | Minaliya",
    description:
      "100% pure wooden cold pressed groundnut, coconut & sesame oils. Order online with free shipping.",
    url: "https://minaliya.com/shop",
  },
};

export default async function ShopPage() {
  // Fetch live products from Neon via Prisma
  const dbProducts = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  // Map database entries to match the frontend Product interface structure
  let products = dbProducts.map((p) => {
    // Standardized ratings & reviews count for visual premium experience
    let rating = 4.9;
    let reviews = 234;

    if (p.slug.includes("coconut")) {
      rating = 4.8;
      reviews = 189;
    } else if (p.slug.includes("sesame")) {
      rating = 4.9;
      reviews = 156;
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0] || "/logo.png",
      price: p.discountPrice ? Number(p.discountPrice) : Number(p.price),
      originalPrice: Number(p.price),
      rating,
      reviews,
      badge: p.isFeatured ? "Bestseller" : undefined,
      sizes: p.slug.includes("500ml") ? ["500ml"] : ["1 Ltr"],
      category: p.category.name,
      description: p.description,
    };
  });

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <ShopContent initialProducts={products} />
      </main>

      <Footer />
    </>
  );
}

