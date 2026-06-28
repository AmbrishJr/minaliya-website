"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, X, Sparkles, Check, AlertCircle, Phone, Building, User, Mail, MessageSquare } from "lucide-react";
import { Product } from "@/data/products";
import { submitInquiry } from "@/actions/inquiry";
import FeaturedProducts from "@/components/home/FeaturedProducts";


const categories = ["All", "Groundnut", "Coconut", "Sesame"];

/* ═══════════════════════════════════════════
   SHOP CONTENT — Responsive Grid Layout
   ═══════════════════════════════════════════ */

export default function ShopContent({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  // Bulk Order Inquiry State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkName, setBulkName] = useState("");
  const [bulkCompany, setBulkCompany] = useState("");
  const [bulkEmail, setBulkEmail] = useState("");
  const [bulkPhone, setBulkPhone] = useState("");
  const [bulkProduct, setBulkProduct] = useState("All Oils");
  const [bulkQuantity, setBulkQuantity] = useState("50");
  const [bulkMessage, setBulkMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!bulkName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!bulkEmail.trim() || !bulkEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (bulkPhone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!bulkQuantity.trim() || Number(bulkQuantity) <= 0) {
      setFormError("Please specify a valid estimated quantity.");
      return;
    }

    // Submit to database via Server Action
    const res = await submitInquiry({
      name: bulkName.trim(),
      company: bulkCompany.trim() || undefined,
      email: bulkEmail.trim(),
      phone: bulkPhone.trim(),
      product: bulkProduct,
      quantity: Number(bulkQuantity),
      message: bulkMessage.trim() || undefined,
    });

    if (!res.success) {
      setFormError(res.error || "Failed to submit inquiry.");
      return;
    }

    const newInquiryId = res.inquiryId || `MIN-BULK-${Date.now().toString().slice(-6)}`;
    const newInquiry = {
      id: newInquiryId,
      name: bulkName.trim(),
      company: bulkCompany.trim(),
      email: bulkEmail.trim(),
      phone: bulkPhone.trim(),
      product: bulkProduct,
      quantity: bulkQuantity,
      message: bulkMessage.trim(),
      date: new Date().toISOString(),
    };

    // Save to local storage for persistence
    try {
      const stored = localStorage.getItem("minaliya-bulk-inquiries");
      const list = stored ? JSON.parse(stored) : [];
      list.push(newInquiry);
      localStorage.setItem("minaliya-bulk-inquiries", JSON.stringify(list));
    } catch (err) {
      console.error("Failed to store bulk inquiry locally:", err);
    }

    setInquiryId(newInquiryId);
    setIsInquirySubmitted(true);

    // Reset inputs
    setBulkName("");
    setBulkCompany("");
    setBulkEmail("");
    setBulkPhone("");
    setBulkProduct("All Oils");
    setBulkQuantity("50");
    setBulkMessage("");
  };

  const filtered =
    activeCategory === "All"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="pt-16 sm:pt-24 lg:pt-32 pb-0" style={{ background: "var(--color-cream-50)" }} aria-label="Shop our oils">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="sr-only">Shop Pure Cold Pressed Oils</h1>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap sm:flex-wrap hide-scrollbar snap-x snap-mandatory mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 snap-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap"
                style={{
                  background:
                    activeCategory === cat ? "var(--color-forest-600)" : "white",
                  color:
                    activeCategory === cat ? "white" : "var(--color-stone-600)",
                  border: `1px solid ${activeCategory === cat
                      ? "var(--color-forest-600)"
                      : "var(--color-stone-200)"
                    }`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts products={filtered} />

      <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bulk Order Banner */}
          <div
            className="p-6 sm:p-12 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden shadow-soft transition-all hover:shadow-medium"
            style={{
              background: "linear-gradient(135deg, var(--color-forest-900) 0%, var(--color-forest-950) 100%)",
              borderColor: "var(--color-forest-800)",
            }}
          >
            {/* Decorative leaf background */}
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/4 -translate-y-1/4"
              style={{ background: "radial-gradient(circle, var(--color-cream-100), transparent 70%)" }}
              aria-hidden="true"
            />

            <div className="space-y-4 max-w-2xl relative z-10 text-center md:text-left">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-amber-200)" }}
              >
                B2B & Wholesale Custom Pricing
              </span>
              <h3
                className="text-3xl sm:text-4xl font-bold leading-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Interested in Bulk Quantities?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-forest-200">
                Whether you are a retail shop, organic store, hotel, or require bulk extraction for private labeling, get custom wooden cold pressed pricing with specialized logistical support.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                onClick={() => {
                  setIsBulkModalOpen(true);
                  setIsInquirySubmitted(false);
                }}
                className="btn-primary py-4 px-8 text-sm font-bold tracking-wide rounded-full border border-transparent shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 cursor-pointer bg-amber-500 hover:bg-amber-600 text-stone-900"
              >
                Get Custom Bulk Quote <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order Inquiry Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-deep overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col animate-scale-up">

            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between shrink-0" style={{ background: "var(--color-cream-50)" }}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">Bulk Order Inquiry</h3>
                  <p className="text-xs text-stone-500">Mara Chekku Wood Pressed Wholesale Pricing</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-6">
              {isInquirySubmitted ? (
                <div className="text-center py-8 space-y-6 animate-fade-in-up">
                  <div className="w-20 h-20 bg-forest-100 text-forest-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Check size={40} className="stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-stone-950 font-heading">Inquiry Submitted Successfully!</h4>
                    <p className="text-sm text-stone-500 max-w-md mx-auto">
                      Thank you for your interest in Minaliya. Our B2B partnership manager will review your details and revert with custom logistics and pricing within 2-4 hours.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 max-w-md mx-auto text-left space-y-2 font-mono text-xs">
                    <div className="flex justify-between"><span className="text-stone-400">Reference ID:</span> <span className="font-bold text-stone-900">{inquiryId}</span></div>
                    <div className="flex justify-between"><span className="text-stone-400">Response Window:</span> <span className="font-semibold text-forest-600">Today, within 4 Hours</span></div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-md mx-auto font-sans">
                    <a
                      href={`https://wa.me/917824807770?text=Hi%20Minaliya,%20I%20just%20submitted%20a%20bulk%20order%20inquiry%20with%20reference%20ID%20${inquiryId}.%20Please%20share%20wholesale%20pricing.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-3 px-6 rounded-full text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white border-transparent"
                    >
                      <Phone size={16} /> Urgent? Chat on WhatsApp
                    </a>
                    <button
                      onClick={() => setIsBulkModalOpen(false)}
                      className="btn-secondary py-3 px-6 rounded-full text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Back to Shop
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBulkSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Business Details Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">1. Business Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-stone-600">Your Full Name</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={bulkName}
                            onChange={(e) => setBulkName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm transition-all"
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-stone-600">Company Name (Optional)</label>
                        <div className="relative">
                          <Building size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="text"
                            placeholder="e.g. Organic Foods Ltd"
                            value={bulkCompany}
                            onChange={(e) => setBulkCompany(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm transition-all"
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-stone-600">Email Address</label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="email"
                            placeholder="e.g. business@organic.com"
                            value={bulkEmail}
                            onChange={(e) => setBulkEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm font-mono transition-all"
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-stone-600">Phone / WhatsApp Number</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={bulkPhone}
                            onChange={(e) => setBulkPhone(e.target.value.replace(/[^0-9]/gi, "").slice(0, 10))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm font-mono transition-all"
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Section */}
                  <div className="border-t border-stone-100 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">2. Product Requirements</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-stone-600">Product of Interest</label>
                        <select
                          value={bulkProduct}
                          onChange={(e) => setBulkProduct(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm cursor-pointer"
                          style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                        >
                          <option value="All Oils">All Wooden Pressed Oils</option>
                          <option value="Groundnut Oil">Wooden Pressed Groundnut Oil</option>
                          <option value="Coconut Oil">Wooden Pressed Coconut Oil</option>
                          <option value="Sesame Oil">Wooden Pressed Sesame Oil</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-stone-600">Estimated Quantity (Litres)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="50"
                            min="20"
                            value={bulkQuantity}
                            onChange={(e) => setBulkQuantity(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm font-mono transition-all"
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                            required
                          />
                          <span className="flex items-center px-4 rounded-xl border bg-stone-50 border-stone-200 text-stone-500 font-semibold text-xs shrink-0 font-sans">
                            Litres
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="border-t border-stone-100 pt-6">
                    <label className="block text-xs font-semibold mb-1 text-stone-600">Additional Instructions / Requirements</label>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <textarea
                        rows={3}
                        placeholder="Please detail any custom packaging, shipping locations, frequency of delivery, or labeling requirements..."
                        value={bulkMessage}
                        onChange={(e) => setBulkMessage(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm transition-all"
                        style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4 flex gap-4 border-t border-stone-100">
                    <button type="submit" className="btn-primary py-3 px-8 text-sm font-bold rounded-full cursor-pointer bg-forest-600 hover:bg-forest-700 text-white border-transparent flex-1 sm:flex-none">
                      Submit Bulk Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBulkModalOpen(false)}
                      className="btn-secondary py-3 px-6 text-sm font-semibold rounded-full cursor-pointer flex-1 sm:flex-none"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}