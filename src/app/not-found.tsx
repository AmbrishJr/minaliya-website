import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <section
          className="relative overflow-hidden py-24 sm:py-32 min-h-[70vh] flex items-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-wood-50) 50%, var(--color-cream-200) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
            style={{ background: "var(--color-wood-300)", filter: "blur(80px)" }}
            aria-hidden="true"
          />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="divider-leaf mx-auto mb-8" />

            <h1
              className="text-8xl sm:text-9xl font-bold leading-none mb-6"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-forest-600)",
                lineHeight: 1,
              }}
            >
              404
            </h1>

            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-stone-800)",
              }}
            >
              Page Not Found
            </h2>

            <p
              className="text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-10"
              style={{ color: "var(--color-stone-500)" }}
            >
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="btn-primary text-base px-8 py-4">
                <Home size={18} />
                Back to Home
              </Link>
              <Link
                href="/shop"
                className="btn-secondary text-base px-8 py-4"
              >
                Browse Our Oils
                <ArrowLeft size={18} className="rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
