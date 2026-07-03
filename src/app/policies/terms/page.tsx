import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Minaliya website and purchasing products.",
  alternates: { canonical: "/policies/terms" },
};

export default function TermsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <section className="py-16 sm:py-24" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-12 border-b pb-8" style={{ borderColor: "var(--color-stone-200)" }}>
              <h1
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
              >
                Terms of Service
              </h1>
              <p className="text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
                Last Updated: May 15, 2026
              </p>
            </header>

            <div className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-stone-800 prose-p:text-stone-600 prose-li:text-stone-600">
              <p>
                Welcome to Minaliya. These terms and conditions outline the rules and regulations for the use of Minaliya&apos;s Website, located at minaliya.com.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use Minaliya if you do not agree to take all of the terms and conditions stated on this page.
              </p>

              <h2>1. Products and Pricing</h2>
              <p>
                All our oils are 100% natural and cold-pressed using traditional Mara Chekku methods. Due to the natural extraction process, slight variations in color, aroma, and sediment are normal and indicative of purity.
              </p>
              <p>
                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
              </p>

              <h2>2. Orders and Payment</h2>
              <p>
                We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
              </p>

              <h2>3. Accuracy of Information</h2>
              <p>
                We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.
              </p>

              <h2>4. User Comments and Feedback</h2>
              <p>
                If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
              </p>

              <h2>Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us at hello@minaliya.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
