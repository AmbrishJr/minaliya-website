import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Minaliya",
  description: "Secure checkout for Minaliya premium cold pressed oils.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1" style={{ background: "var(--color-cream-50)" }}>
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}
