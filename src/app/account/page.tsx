import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account | Minaliya",
  description: "Manage your Minaliya account, orders, and addresses.",
  alternates: { canonical: "/account" },
};

export default function AccountPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content" className="flex-1" style={{ background: "var(--color-cream-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="mb-10">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
            >
              My Account
            </h1>
            <p className="text-lg" style={{ color: "var(--color-stone-500)" }}>
              Welcome back, User! View your recent orders and manage your profile.
            </p>
          </div>

          <AccountDashboard />
        </div>
      </main>

      <Footer />
    </>
  );
}
