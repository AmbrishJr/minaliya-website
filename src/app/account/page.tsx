import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Package, MapPin, LogOut, Settings, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <nav className="flex flex-col gap-2 p-6 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: "var(--color-forest-50)", color: "var(--color-forest-700)" }}
                >
                  <User size={18} />
                  Profile Details
                </Link>
                <Link
                  href="#orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-stone-50"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  <Package size={18} />
                  Order History
                </Link>
                <Link
                  href="#addresses"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-stone-50"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  <MapPin size={18} />
                  Saved Addresses
                </Link>
                <Link
                  href="#payment"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-stone-50"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  <CreditCard size={18} />
                  Payment Methods
                </Link>
                <Link
                  href="#settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-stone-50"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  <Settings size={18} />
                  Account Settings
                </Link>
                <div className="h-px w-full my-2" style={{ background: "var(--color-stone-200)" }}></div>
                <button
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 text-red-600 text-left"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Overview Card */}
              <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)", borderColor: "white", boxShadow: "var(--shadow-soft)" }}>
                      U
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>Guest User</h2>
                      <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>user@example.com</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm py-2 px-4">Edit Profile</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t" style={{ borderColor: "var(--color-stone-200)" }}>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-stone-400)", fontWeight: "600" }}>Phone Number</p>
                    <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>+91 98765 43210</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-stone-400)", fontWeight: "600" }}>Member Since</p>
                    <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>May 2026</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-stone-400)", fontWeight: "600" }}>Newsletter</p>
                    <p className="font-medium text-sm text-green-600">Subscribed</p>
                  </div>
                </div>
              </section>

              {/* Recent Orders Overview */}
              <section id="orders">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>Recent Orders</h3>
                  <Link href="/account/orders" className="text-sm font-medium flex items-center hover:underline" style={{ color: "var(--color-forest-600)" }}>
                    View All <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="rounded-2xl border overflow-hidden" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}>
                      <Package size={28} />
                    </div>
                    <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>No orders yet</h4>
                    <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                      When you place orders, they will appear here. Start shopping our premium oils today.
                    </p>
                    <Link href="/shop" className="btn-primary text-sm py-2.5">
                      Explore Shop
                    </Link>
                  </div>
                </div>
              </section>

              {/* Default Address */}
              <section id="addresses">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>Default Address</h3>
                  <button className="text-sm font-medium flex items-center hover:underline" style={{ color: "var(--color-forest-600)" }}>
                    Manage Addresses <ChevronRight size={16} />
                  </button>
                </div>

                <div className="p-6 rounded-2xl border flex flex-col sm:flex-row gap-6 justify-between items-start" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <MapPin size={20} style={{ color: "var(--color-stone-400)" }} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1" style={{ color: "var(--color-stone-800)" }}>Guest User</h4>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-stone-500)" }}>
                        123 Artisanal Way, Suite 4B<br />
                        Mumbai, Maharashtra 400001<br />
                        India
                      </p>
                      <p className="text-sm font-medium" style={{ color: "var(--color-stone-700)" }}>Mobile: +91 98765 43210</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm py-1.5 px-4 rounded-full w-full sm:w-auto">Edit</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
