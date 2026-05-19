import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyColdPressed from "@/components/home/WhyColdPressed";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import FAQSection from "@/components/home/FAQSection";
import BlogPreview from "@/components/home/BlogPreview";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <HeroSection />
        <TrustSection />
        <FeaturedProducts />
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
