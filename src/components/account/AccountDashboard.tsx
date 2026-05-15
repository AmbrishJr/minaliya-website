"use client";

import { useState } from "react";
import { User, Package, MapPin, LogOut, Settings, CreditCard, ChevronRight, Edit } from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/context/OrderContext";

type Tab = "profile" | "orders" | "addresses" | "payment" | "settings" | "edit-profile";

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { orders } = useOrders();

  const renderTabButton = (tab: Tab, icon: React.ReactNode, label: string) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
          isActive
            ? "bg-[var(--color-forest-50)] text-[var(--color-forest-700)]"
            : "hover:bg-stone-50 text-[var(--color-stone-700)]"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1">
        <nav
          className="flex flex-col gap-2 p-6 rounded-2xl border"
          style={{ background: "white", borderColor: "var(--color-stone-200)" }}
        >
          {renderTabButton("profile", <User size={18} />, "Profile Details")}
          {renderTabButton("orders", <Package size={18} />, "Order History")}
          {renderTabButton("addresses", <MapPin size={18} />, "Saved Addresses")}
          {renderTabButton("payment", <CreditCard size={18} />, "Payment Methods")}
          {renderTabButton("settings", <Settings size={18} />, "Account Settings")}
          <div className="h-px w-full my-2" style={{ background: "var(--color-stone-200)" }}></div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 text-red-600 text-left w-full">
            <LogOut size={18} />
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-8">
        {activeTab === "profile" && (
          <>
            <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                    style={{
                      background: "var(--color-amber-100)",
                      color: "var(--color-amber-700)",
                      borderColor: "white",
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    U
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
                    >
                      Guest User
                    </h2>
                    <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
                      user@example.com
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("edit-profile")} className="btn-secondary text-sm py-2 px-4">
                  Edit Profile
                </button>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t"
                style={{ borderColor: "var(--color-stone-200)" }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Phone Number
                  </p>
                  <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>
                    +91 98765 43210
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Member Since
                  </p>
                  <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>
                    May 2026
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Newsletter
                  </p>
                  <p className="font-medium text-sm text-green-600">Subscribed</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
                >
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-sm font-medium flex items-center hover:underline"
                  style={{ color: "var(--color-forest-600)" }}
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ background: "white", borderColor: "var(--color-stone-200)" }}
              >
                {orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                    >
                      <Package size={28} />
                    </div>
                    <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>
                      No orders yet
                    </h4>
                    <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                      When you place orders, they will appear here. Start shopping our premium oils today.
                    </p>
                    <Link href="/shop" className="btn-primary text-sm py-2.5">
                      Explore Shop
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--color-stone-200)" }}>
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-stone-900">{order.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>{order.status}</span>
                          </div>
                          <p className="text-sm text-stone-500">{new Date(order.date).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                          <span className="font-bold text-stone-900">₹{order.totalPrice}</span>
                          <button onClick={() => setActiveTab("orders")} className="btn-secondary py-1.5 px-4 text-sm whitespace-nowrap">Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
                >
                  Default Address
                </h3>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="text-sm font-medium flex items-center hover:underline"
                  style={{ color: "var(--color-forest-600)" }}
                >
                  Manage Addresses <ChevronRight size={16} />
                </button>
              </div>

              <div
                className="p-6 rounded-2xl border flex flex-col sm:flex-row gap-6 justify-between items-start"
                style={{ background: "white", borderColor: "var(--color-stone-200)" }}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} style={{ color: "var(--color-stone-400)" }} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: "var(--color-stone-800)" }}>
                      Guest User
                    </h4>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-stone-500)" }}>
                      123 Artisanal Way, Suite 4B<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-stone-700)" }}>
                      Mobile: +91 98765 43210
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="btn-secondary text-sm py-1.5 px-4 rounded-full w-full sm:w-auto"
                >
                  Edit
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "orders" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
              Order History
            </h3>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                >
                  <Package size={28} />
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>
                  No orders yet
                </h4>
                <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                  You haven't placed any orders. Discover our cold-pressed oils.
                </p>
                <Link href="/shop" className="btn-primary text-sm py-2.5">
                  Explore Shop
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border overflow-hidden" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}>
                    <div className="p-5 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-bold">Order Placed</p>
                          <p className="text-sm font-medium text-stone-900">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-bold">Total Amount</p>
                          <p className="text-sm font-medium text-stone-900">₹{order.totalPrice}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <p className="text-sm text-stone-500 mb-0.5">Order # <span className="font-medium text-stone-900">{order.id}</span></p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>{order.status}</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg bg-white border flex items-center justify-center shrink-0 p-2" style={{ borderColor: "var(--color-stone-200)" }}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                            <p className="text-xs text-stone-500 mt-1">Size: {item.size}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs font-medium text-stone-600">Qty: {item.quantity}</p>
                              <p className="font-bold text-stone-900 text-sm">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "addresses" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Saved Addresses
              </h3>
              <button className="btn-primary text-sm py-2 px-4">Add New Address</button>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 rounded-xl border flex flex-col sm:flex-row gap-6 justify-between items-start" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-forest-200)" }}>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} style={{ color: "var(--color-forest-600)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold" style={{ color: "var(--color-stone-800)" }}>Guest User</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-700" style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)" }}>Default</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-stone-500)" }}>
                      123 Artisanal Way, Suite 4B<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-stone-700)" }}>Mobile: +91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="btn-secondary text-sm py-1.5 px-4 rounded-full flex-1 sm:flex-none">Edit</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "payment" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Payment Methods
              </h3>
              <button className="btn-primary text-sm py-2 px-4">Add Payment Method</button>
            </div>
            <div className="text-center py-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
              >
                <CreditCard size={28} />
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>
                No saved payment methods
              </h4>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                Save your credit or debit cards for faster checkout next time.
              </p>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
              Account Settings
            </h3>
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-stone-700)" }}>Email Preferences</label>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="newsletter" defaultChecked className="w-4 h-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500" />
                  <label htmlFor="newsletter" className="text-sm" style={{ color: "var(--color-stone-600)" }}>Subscribe to newsletter for offers and updates</label>
                </div>
              </div>
              <div className="pt-4 border-t" style={{ borderColor: "var(--color-stone-200)" }}>
                <h4 className="font-bold mb-4" style={{ color: "var(--color-stone-800)" }}>Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  <button className="btn-primary text-sm py-2.5 px-6">Update Password</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "edit-profile" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Edit Profile
              </h3>
              <button onClick={() => setActiveTab("profile")} className="text-sm font-medium hover:underline" style={{ color: "var(--color-stone-500)" }}>Cancel</button>
            </div>
            
            <form className="space-y-5 max-w-lg" onSubmit={(e) => { e.preventDefault(); setActiveTab("profile"); }}>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)", borderColor: "white", boxShadow: "var(--shadow-soft)" }}>
                  U
                </div>
                <button type="button" className="btn-secondary text-sm py-2 px-4">Change Photo</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>First Name</label>
                  <input type="text" defaultValue="Guest" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Email Address</label>
                <input type="email" defaultValue="user@example.com" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Phone Number</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
              </div>
              
              <div className="pt-4">
                <button type="submit" className="btn-primary text-sm py-2.5 px-6">Save Changes</button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
