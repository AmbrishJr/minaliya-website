import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getSiteSettings } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout | Minaliya",
  description: "Secure checkout for Minaliya premium cold pressed oils.",
  alternates: { canonical: "/checkout" },
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1" style={{ background: "var(--color-cream-50)" }}>
        <CheckoutClient storeMode={settings.storeMode} />
      </main>
      <Footer />
    </>
  );
}
