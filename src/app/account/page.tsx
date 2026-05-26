"use client";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountDashboard from "@/components/account/AccountDashboard";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AccountPage() {
  const { isAuthenticated, user, openLoginModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We don't necessarily want to force redirect immediately if we want to show a "Please login" screen
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-md w-full px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6 text-stone-300">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Login Required</h1>
            <p className="text-stone-500 mb-8">Please login to your account to view your profile, orders, and addresses.</p>
            <button onClick={openLoginModal} className="btn-primary w-full justify-center py-4">
              Login with WhatsApp
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              Welcome back, {user?.name?.split(" ")[0] || "there"}! View your recent orders and manage your profile.
            </p>
          </div>

          <AccountDashboard />
        </div>
      </main>

      <Footer />
    </>
  );
}
