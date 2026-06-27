import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustSection from "@/components/home/TrustSection";
import WhyColdPressed from "@/components/home/WhyColdPressed";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import FAQSection from "@/components/home/FAQSection";
import BlogPreview from "@/components/home/BlogPreview";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getActiveHeroSlides } from "@/actions/adminData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dbProducts, heroSlides] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }),
    getActiveHeroSlides(),
  ]);

  const products = dbProducts.map((p) => {
    let rating = 4.9;
    let reviews = 234;
    if (p.slug.includes("coconut")) { rating = 4.8; reviews = 189; }
    else if (p.slug.includes("sesame")) { rating = 4.9; reviews = 156; }

    return {
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
        <HeroSection slides={heroSlides} />
        <FeaturedProducts products={products} />
        <TrustSection />
        <WhyColdPressed />
        <ProcessSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FAQSection />
        <BlogPreview />
        <WhatsAppCTA />
      </main>

      <Footer />
    </>
  );
}
