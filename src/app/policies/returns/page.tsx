import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Minaliya's return, refund, and replacement policy for cold pressed oils.",
  alternates: { canonical: "/policies/returns" },
};

export default function ReturnsPage() {
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
                Return & Refund Policy
              </h1>
              <p className="text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
                Last Updated: May 15, 2026
              </p>
            </header>

            <div className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-stone-800 prose-p:text-stone-600 prose-li:text-stone-600">
              <p>
                At Minaliya, we take immense pride in the quality and purity of our cold pressed oils. However, if you are not entirely satisfied with your purchase, we&apos;re here to help.
              </p>

              <h2>Damaged or Defective Items</h2>
              <p>
                If you receive a damaged bottle (e.g., leakage during transit, broken seal), please contact us within 48 hours of delivery. 
              </p>
              <ul>
                <li>Send an email to hello@minaliya.com or WhatsApp us with photos of the damaged product and the shipping box.</li>
                <li>Include your order number.</li>
                <li>We will arrange for a free replacement to be sent to you immediately.</li>
              </ul>

              <h2>Returns</h2>
              <p>
                Because our products are food items, we generally cannot accept returns for products that have been opened or used. 
              </p>
              <p>
                Unopened items in their original condition and packaging can be returned within 7 days of delivery. The customer is responsible for the return shipping costs.
              </p>

              <h2>Refunds</h2>
              <p>
                Once we receive your returned item, we will inspect it and notify you. If your return is approved, we will initiate a refund to your original method of payment.
              </p>
              <p>
                You will receive the credit within a certain amount of days, depending on your card issuer&apos;s policies (usually 5-7 business days).
              </p>

              <h2>Cancellations</h2>
              <p>
                Orders can be cancelled before they are dispatched (usually within 12 hours of placing the order). Once dispatched, orders cannot be cancelled.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions on how to return your item to us, contact us at hello@minaliya.com or via WhatsApp.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
