"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { ChevronRight, Lock, MapPin, CreditCard, CheckCircle2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutClient() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [selectedPayment, setSelectedPayment] = useState<"card" | "upi" | "cod">("card");
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null);
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" });

  const shippingCost = totalPrice >= 499 ? 0 : 50;
  const finalTotal = totalPrice + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    addOrder({
      id: `MNL-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...items],
      totalPrice: finalTotal,
      status: "Processing"
    });

    setStep("success");
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === "success") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: "var(--color-forest-100)", color: "var(--color-forest-600)" }}>
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Thank you for your order!
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--color-stone-500)" }}>
          Your order #MNL-{Math.floor(100000 + Math.random() * 900000)} has been placed successfully. We'll send you an email confirmation shortly.
        </p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-cream-100)", color: "var(--color-stone-300)" }}>
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Your cart is empty
        </h2>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "var(--color-stone-500)" }}>
          Looks like you haven't added any pure oils to your cart yet.
        </p>
        <Link href="/shop" className="btn-primary">
          Discover Our Oils
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-8 flex items-center gap-2 text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
        <Link href="/cart" className="hover:text-stone-800 transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Checkout
        </h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-700)" }}>
          <Lock size={14} /> Secure Checkout
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Breadcrumbs/Progress */}
          <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
            <button
              onClick={() => setStep("shipping")}
              className={`text-sm font-bold flex items-center gap-2 ${step === "shipping" ? "text-stone-900" : "text-stone-400"}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "shipping" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>1</span>
              Shipping Details
            </button>
            <div className="h-px w-8 bg-stone-200" />
            <button
              onClick={() => setStep("payment")}
              disabled={step === "shipping"}
              className={`text-sm font-bold flex items-center gap-2 ${step === "payment" ? "text-stone-900" : "text-stone-400"}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "payment" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>2</span>
              Payment
            </button>
          </div>

          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            {step === "shipping" && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <MapPin size={20} className="text-forest-600" /> Contact & Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Email Address</label>
                    <input required type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>First Name</label>
                    <input required type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Last Name</label>
                    <input required type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Address</label>
                    <input required type="text" placeholder="123 Main St, Apartment 4B" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>City</label>
                    <input required type="text" placeholder="Chennai" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Postal Code / ZIP</label>
                    <input required type="text" placeholder="600001" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Phone Number (for delivery updates)</label>
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" style={{ background: "white", borderColor: "var(--color-stone-200)" }} />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="button" onClick={() => setStep("payment")} className="btn-primary py-3.5 px-8 text-base">
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <CreditCard size={20} className="text-forest-600" /> Payment Details
                </h2>

                <div className="space-y-4">
                  {/* Payment Options */}
                  <label 
                    className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" 
                    style={{ 
                      borderColor: selectedPayment === "card" ? "var(--color-forest-600)" : "var(--color-stone-200)", 
                      background: selectedPayment === "card" ? "var(--color-forest-50)" : "white" 
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                      className="w-5 h-5 text-forest-600 focus:ring-forest-500" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">Credit / Debit Card</p>
                      <p className="text-sm text-stone-500">Securely pay with your card</p>
                    </div>
                  </label>

                  <label 
                    className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-stone-50" 
                    style={{ 
                      borderColor: selectedPayment === "upi" ? "var(--color-forest-600)" : "var(--color-stone-200)", 
                      background: selectedPayment === "upi" ? "var(--color-forest-50)" : "white" 
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={selectedPayment === "upi"}
                      onChange={() => setSelectedPayment("upi")}
                      className="w-5 h-5 text-forest-600 focus:ring-forest-500" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">UPI / Netbanking</p>
                      <p className="text-sm text-stone-500">Pay using your preferred UPI app</p>
                    </div>
                  </label>
                  
                  <label 
                    className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-stone-50" 
                    style={{ 
                      borderColor: selectedPayment === "cod" ? "var(--color-forest-600)" : "var(--color-stone-200)", 
                      background: selectedPayment === "cod" ? "var(--color-forest-50)" : "white" 
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={selectedPayment === "cod"}
                      onChange={() => setSelectedPayment("cod")}
                      className="w-5 h-5 text-forest-600 focus:ring-forest-500" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">Cash on Delivery</p>
                      <p className="text-sm text-stone-500">Pay when you receive the order</p>
                    </div>
                  </label>
                </div>

                {/* Card Details Section */}
                {selectedPayment === "card" && (
                  <div className="p-6 rounded-xl border mt-6 animate-fade-in" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Card Number</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                          className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                          style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} 
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Expiry Date</label>
                          <input 
                            type="month" 
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} 
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>CVC</label>
                          <input 
                            type="text" 
                            placeholder="123" 
                            value={cardData.cvc}
                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Options Section */}
                {selectedPayment === "upi" && (
                  <div className="p-6 rounded-xl border mt-6 animate-fade-in" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                    <p className="text-sm font-bold mb-4" style={{ color: "var(--color-stone-800)" }}>Choose a UPI option</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["GPay", "Razorpay", "PhonePe", "Netbanking"].map((method) => {
                        const isSelected = selectedUpi === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedUpi(method)}
                            className="p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2"
                            style={{ 
                              borderColor: isSelected ? "var(--color-forest-600)" : "var(--color-stone-200)",
                              background: isSelected ? "var(--color-forest-50)" : "white",
                              color: isSelected ? "var(--color-forest-700)" : "var(--color-stone-700)"
                            }}
                          >
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                              style={{ 
                                background: isSelected ? "var(--color-forest-100)" : "var(--color-stone-100)",
                                color: isSelected ? "var(--color-forest-600)" : "var(--color-stone-400)"
                              }}
                            >
                              {method[0]}
                            </div>
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex items-center justify-between">
                  <button type="button" onClick={() => setStep("shipping")} className="text-sm font-medium hover:underline text-stone-500">
                    Return to Shipping
                  </button>
                  <button type="submit" form="checkout-form" className="btn-primary py-4 px-10 text-base shadow-lg shadow-forest-600/20">
                    Pay ₹{finalTotal} & Place Order
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border sticky top-24 overflow-hidden" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="p-6 border-b bg-stone-50/50" style={{ borderColor: "var(--color-stone-200)" }}>
              <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Order Summary
              </h3>
            </div>
            
            <div className="p-6 space-y-6 max-h-[45vh] overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center border" style={{ background: "var(--color-cream-100)", borderColor: "var(--color-stone-100)" }}>
                    <Image src={item.image} alt={item.name} width={50} height={50} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate" style={{ color: "var(--color-stone-800)" }}>{item.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{item.size} × {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-stone-50/50 space-y-4" style={{ borderColor: "var(--color-stone-200)" }}>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-stone-800">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span className="font-bold text-stone-800">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
              </div>
              
              <div className="pt-4 mt-2 border-t flex justify-between items-center" style={{ borderColor: "var(--color-stone-200)" }}>
                <span className="text-base font-bold text-stone-900">Total</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
