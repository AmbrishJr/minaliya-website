"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { ChevronRight, Lock, MapPin, CheckCircle2, ShoppingBag, ArrowLeft, AlertCircle, Tag, X, ChevronDown, Shield } from "lucide-react";
import { createOrder } from "@/actions/order";
import { lookupPincode } from "@/actions/lookupPincode";
import { useAuth } from "@/context/AuthContext";

const FREE_SHIPPING_STATES = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Telangana",
  "Andhra Pradesh",
];

interface Coupon {
  code: string;
  type: "percentage" | "freeship";
  value: number; // e.g. 10 for 10%
  minOrderValue?: number; // e.g. 500
  description: string;
}

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "10% off on all items! (First-time user offer)",
  },
  {
    code: "FESTIVAL15",
    type: "percentage",
    value: 15,
    minOrderValue: 500,
    description: "15% off on orders above ₹500 (Festival Offer)",
  },
  {
    code: "MINALIYA20",
    type: "percentage",
    value: 20,
    minOrderValue: 1000,
    description: "20% off on orders above ₹1000 (Premium/Special Offer)",
  },
  {
    code: "FREESHIP",
    type: "freeship",
    value: 0,
    description: "Free shipping on your first order!",
  },
];

export default function CheckoutClient() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { orders, addOrder } = useOrders();
  const { user, isAuthenticated, isAuthReady, openLoginModal } = useAuth();

  // Protect checkout route
  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      openLoginModal();
      router.push("/shop");
    }
  }, [isAuthReady, isAuthenticated, openLoginModal, router]);

  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [razorpayError, setRazorpayError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Shipping form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
  const [formError, setFormError] = useState("");


  // Saved address state
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | "new">("new");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Derived: saved addresses from user profile
  const savedAddresses: Address[] = Array.isArray(user?.addresses)
    ? (user.addresses as Address[]).filter(Boolean)
    : [];

  // Auto-select the default address when user data loads from localStorage
  useEffect(() => {
    if (!user || hasAutoSelected) return;
    const addrs: Address[] = Array.isArray(user.addresses)
      ? (user.addresses as Address[]).filter(Boolean)
      : [];
    const defAddr = addrs.find((a) => a.isDefault) || addrs[0] || null;
    if (defAddr) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSavedAddressId(defAddr.id);
      const nameParts = defAddr.name.trim().split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setAddress([defAddr.addressLine1, defAddr.addressLine2].filter(Boolean).join(", "));
      setCity(defAddr.city);
      setPostalCode(defAddr.zipCode);
      setPhone(defAddr.phone);
      setShippingState(defAddr.state);
    } else {
      if (user.mobile) setPhone(user.mobile);
    }
    if (user.email) setEmail(user.email);
    setHasAutoSelected(true);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced pincode lookup
  useEffect(() => {
    if (postalCode.trim().length !== 6) return;
    const timer = setTimeout(async () => {
      setIsLookingUpPincode(true);
      const res = await lookupPincode(postalCode.trim());
      if (res.success && res.state) {
        setShippingState(FREE_SHIPPING_STATES.includes(res.state) ? res.state : "Other");
      }
      setIsLookingUpPincode(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [postalCode]);

  // Handler: user picks a saved address card or "new"
  const handleSelectSavedAddress = (id: string | "new") => {
    setSelectedSavedAddressId(id);
    if (id === "new") {
      setFirstName("");
      setLastName("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setPhone(user?.mobile || "");
      setShippingState("");
      return;
    }
    const addr = savedAddresses.find((a) => a.id === id);
    if (!addr) return;
    const nameParts = addr.name.trim().split(" ");
    setFirstName(nameParts[0] || "");
    setLastName(nameParts.slice(1).join(" ") || "");
    setAddress([addr.addressLine1, addr.addressLine2].filter(Boolean).join(", "));
    setCity(addr.city);
    setPostalCode(addr.zipCode);
    setPhone(addr.phone);
    setShippingState(addr.state);
  };

  // Coupon states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const hasSubscription = items.some((item) => item.slug.startsWith("subscription-"));

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.type === "percentage") {
    discountAmount = Math.round((totalPrice * appliedCoupon.value) / 100);
  }

  // Shipping cost: free if subscription, or order total >= 499, FREESHIP coupon,
  // or shipping to Tamil Nadu, Kerala, Karnataka, Telangana, or Andhra Pradesh
  const isFreeShipCoupon = appliedCoupon?.type === "freeship";
  const isFreeShippingState = FREE_SHIPPING_STATES.includes(shippingState);
  const shippingCost = (totalPrice >= 499 || hasSubscription || isFreeShipCoupon || isFreeShippingState) ? 0 : 50;

  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  const handleApplyCoupon = (code: string) => {
    setCouponError("");
    setCouponSuccess("");
    
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const coupon = AVAILABLE_COUPONS.find(c => c.code === formattedCode);
    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    // Check minimum order value constraint
    if (coupon.minOrderValue && totalPrice < coupon.minOrderValue) {
      setCouponError(`This coupon requires a minimum order value of ₹${coupon.minOrderValue}.`);
      return;
    }

    // FREESHIP is for first order only
    if (coupon.code === "FREESHIP" && orders.length > 0) {
      setCouponError("The FREESHIP coupon is valid for first-time orders only.");
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  const handleRazorpayPayment = useCallback(async () => {
    setIsRazorpayLoading(true);
    setRazorpayError("");

    try {
      const orderPayload = {
        totalAmount: finalTotal,
        shippingAddress: {
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: shippingState || "Tamil Nadu",
          pinCode: postalCode.trim(),
        },
        paymentMethod: "RAZORPAY",
        paymentStatus: "PENDING",
        items: items.map((item) => ({
          productSlug: item.slug,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const orderRes = await createOrder(orderPayload);

      if (!orderRes.success) {
        setRazorpayError(orderRes.error || "Failed to create order.");
        setIsRazorpayLoading(false);
        return;
      }

      const dbOrderId = orderRes.orderId!;

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal, currency: "INR" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create Razorpay order.");
      }

      const razorpayOrder = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Minaliya",
        description: "Purchase Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#072654" },
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: dbOrderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            addOrder({
              id: dbOrderId,
              date: new Date().toISOString(),
              items: [...items],
              totalPrice: finalTotal,
              status: "Processing",
            });
            clearCart();
            router.push(`/payment/success?razorpay_payment_id=${response.razorpay_payment_id}`);
          } else {
            router.push("/payment/failed");
          }
        },
        modal: {
          ondismiss: function () {
            setIsRazorpayLoading(false);
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function () {
        router.push("/payment/failed");
      });
      rzp.open();
    } catch (err: unknown) {
      setRazorpayError((err as { message?: string }).message || "Something went wrong. Please try again.");
      setIsRazorpayLoading(false);
    }
  }, [finalTotal, firstName, lastName, email, phone, shippingState, address, city, postalCode, items, addOrder, clearCart, router]);



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
          Looks like you haven&apos;t added any pure oils to your cart yet.
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
        <Link href="/shop" className="hover:text-stone-800 transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Shop
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

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-10">
        {/* Main Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Breadcrumbs/Progress */}
          <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
            <button
              onClick={() => setStep("shipping")}
              className={`text-sm font-bold flex items-center gap-2 ${step === "shipping" ? "text-stone-900" : "text-stone-400"}`}
            >
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs ${step === "shipping" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>1</span>
              <span className="hidden sm:inline">Shipping Details</span><span className="sm:hidden">Shipping</span>
            </button>
            <div className="h-px w-8 bg-stone-200" />
            <button
              onClick={() => {
                if (email && firstName && lastName && address && city && postalCode && shippingState && phone) {
                  setStep("payment");
                } else {
                  setFormError("Please fill out all shipping details first.");
                }
              }}
              className={`text-sm font-bold flex items-center gap-2 ${step === "payment" ? "text-stone-900" : "text-stone-400"}`}
            >
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs ${step === "payment" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>2</span>
              Payment
            </button>
          </div>

          <form id="checkout-form" className="space-y-8">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {step === "shipping" && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <MapPin size={20} className="text-forest-600" /> Contact &amp; Shipping Information
                </h2>
                <p className="text-xs font-medium px-3 py-2 rounded-lg" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-700)" }}>
                  Free shipping is available in Tamil Nadu, Kerala, Karnataka, Telangana &amp; Andhra Pradesh
                </p>

                {/* Email – always shown and editable */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                    style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                  />
                </div>

                {/* ── Saved Addresses Selector (only when user has saved addresses) ── */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-stone-600)" }}>
                      Select a delivery address
                    </p>
                    <div className="space-y-2.5">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedSavedAddressId === addr.id;
                        return (
                          <label
                            key={addr.id}
                            htmlFor={`addr-${addr.id}`}
                            className="flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                            style={{
                              borderColor: isSelected ? "var(--color-forest-500)" : "var(--color-stone-200)",
                              background: isSelected ? "var(--color-forest-50)" : "white",
                            }}
                          >
                            <input
                              type="radio"
                              id={`addr-${addr.id}`}
                              name="saved_address"
                              value={addr.id}
                              checked={isSelected}
                              onChange={() => handleSelectSavedAddress(addr.id)}
                              className="mt-0.5 w-4 h-4 shrink-0 accent-forest-600"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm" style={{ color: "var(--color-stone-900)" }}>
                                  {addr.name}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)" }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mt-0.5 leading-snug" style={{ color: "var(--color-stone-500)" }}>
                                {[addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ")}
                              </p>
                              <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
                                {addr.city}, {addr.state} &mdash; {addr.zipCode}
                              </p>
                              <p className="text-xs mt-1" style={{ color: "var(--color-stone-400)" }}>{addr.phone}</p>
                            </div>
                          </label>
                        );
                      })}

                      {/* Option: enter a completely new address */}
                      <label
                        htmlFor="addr-new"
                        className="flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                        style={{
                          borderColor: selectedSavedAddressId === "new" ? "var(--color-forest-500)" : "var(--color-stone-200)",
                          background: selectedSavedAddressId === "new" ? "var(--color-forest-50)" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          id="addr-new"
                          name="saved_address"
                          value="new"
                          checked={selectedSavedAddressId === "new"}
                          onChange={() => handleSelectSavedAddress("new")}
                          className="w-4 h-4 shrink-0 accent-forest-600"
                        />
                        <span className="text-sm font-semibold" style={{ color: "var(--color-stone-700)" }}>
                          + Enter a different address
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Manual address form (shown when no saved addresses OR "new" chosen) ── */}
                {(savedAddresses.length === 0 || selectedSavedAddressId === "new") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>First Name</label>
                      <input
                        required
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                        style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Last Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                        style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Address</label>
                      <input
                        required
                        type="text"
                        placeholder="123 Main St, Apartment 4B"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                        style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>City</label>
                      <input
                        required
                        type="text"
                        placeholder="Chennai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                        style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Postal Code / ZIP</label>
                      <input
                        required
                        type="text"
                        placeholder="600001"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                        style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>
                        State {isLookingUpPincode && <span className="text-forest-500 text-xs ml-1">Looking up...</span>}
                      </label>
                      <select
                        required
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all bg-white"
                        style={{ borderColor: "var(--color-stone-200)" }}
                      >
                        <option value="">Select state</option>
                        {FREE_SHIPPING_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Phone Number (for delivery updates)</label>
                      <input
                        required
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/gi, "").slice(0, 10))}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                        style={{ background: "white", borderColor: "var(--color-stone-200)" }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (email && firstName && lastName && address && city && postalCode && shippingState && phone) {
                        setStep("payment");
                        setFormError("");
                      } else {
                        setFormError("Please fill out all required shipping details first.");
                      }
                    }}
                    className="btn-primary w-full sm:w-auto py-3.5 px-6 sm:px-8 text-sm sm:text-base justify-center"
                  >
                    Continue <span className="hidden sm:inline">to Payment</span> <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <Shield size={20} className="text-forest-600" /> Complete Payment
                </h2>

                <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
                  You will be redirected to Razorpay&apos;s secure checkout to complete your payment.
                </p>

                {razorpayError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{razorpayError}</span>
                  </div>
                )}

                <div className="p-6 rounded-xl border text-center" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                  <img
                    src="https://cdn.razorpay.com/logo.svg"
                    alt="Razorpay"
                    className="h-8 mx-auto mb-4 opacity-80"
                  />
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>
                    Secured by Razorpay
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-stone-400)" }}>
                    Pay using UPI, Card, Netbanking, Wallet &amp; more
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button type="button" onClick={() => setStep("shipping")} className="text-sm font-medium hover:underline text-stone-500">
                    Return to Shipping
                  </button>
                  <button
                    type="button"
                    disabled={isRazorpayLoading}
                    onClick={handleRazorpayPayment}
                    className="btn-primary py-3 sm:py-4 px-4 sm:px-10 text-sm sm:text-base shadow-lg shadow-forest-600/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {isRazorpayLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Pay ₹{finalTotal} with Razorpay</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border sticky top-24 overflow-hidden" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="p-4 sm:p-6 border-b bg-stone-50/50" style={{ borderColor: "var(--color-stone-200)" }}>
              <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Order Summary
              </h3>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[50vh] overflow-y-auto">
              {items.map((item) => {
                const amountInclGst = item.price * item.quantity;
                const amountExGst = amountInclGst / 1.05;
                const gstAmount = amountInclGst - amountExGst;
                const pricePerUnitExGst = item.price / 1.05;

                return (
                <div key={`${item.slug}-${item.size}`} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center border" style={{ background: "var(--color-cream-100)", borderColor: "var(--color-stone-100)" }}>
                    <Image src={item.image} alt={item.name} width={50} height={50} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate" style={{ color: "var(--color-stone-800)" }}>{item.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5 mb-2">{item.size} × {item.quantity}</p>
                    
                    <div className="text-[10px] sm:text-xs text-stone-500 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 bg-stone-50 p-2 rounded-md border" style={{ borderColor: "var(--color-stone-100)" }}>
                      <div className="flex justify-between"><span>Price/Unit:</span> <span className="font-medium text-stone-700">₹{pricePerUnitExGst.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Discount:</span> <span className="font-medium text-stone-700">₹0.00</span></div>
                      <div className="flex justify-between"><span>GST (5%):</span> <span className="font-medium text-stone-700">₹{gstAmount.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Amount:</span> <span className="font-bold text-stone-800">₹{amountInclGst.toFixed(2)}</span></div>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {/* Promo Code & Coupon section */}
            <div className="p-4 sm:p-6 border-t space-y-4" style={{ borderColor: "var(--color-stone-200)" }}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-stone-500)" }}>
                  Promo / Coupon Code
                </label>
                
                {appliedCoupon ? (
                  <div 
                    className="flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 animate-fade-in"
                    style={{ 
                      borderColor: "var(--color-forest-300)", 
                      background: "var(--color-forest-50)", 
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-forest-700 bg-forest-100">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-forest-800 tracking-wide uppercase">{appliedCoupon.code}</p>
                        <p className="text-xs text-forest-600 mt-0.5">
                          {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% Discount Applied` : "Free Shipping Applied"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-lg text-forest-600 hover:bg-forest-100 transition-colors"
                      title="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponError) setCouponError("");
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium tracking-wide placeholder-stone-400 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                      style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(couponInput)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all text-white bg-forest-600 hover:bg-forest-700 active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs font-semibold text-forest-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-forest-600" /> {couponSuccess}
                  </p>
                )}
              </div>

              {/* Collapsible Shelf / Available Coupons */}
              <div className="border-t pt-3" style={{ borderColor: "var(--color-stone-100)" }}>
                <details className="group">
                  <summary className="flex items-center justify-between text-xs font-bold uppercase tracking-wider cursor-pointer list-none select-none text-stone-500 hover:text-stone-800 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} /> Available Offers
                    </span>
                    <span className="transition-transform duration-200 group-open:rotate-180">
                      <ChevronDown size={14} />
                    </span>
                  </summary>
                  
                  <div className="mt-3 space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_COUPONS.map((coupon) => {
                      const isApplied = appliedCoupon?.code === coupon.code;
                      const isSubtotalTooLow = coupon.minOrderValue ? totalPrice < coupon.minOrderValue : false;
                      const isNotFirstOrder = coupon.code === "FREESHIP" && orders.length > 0;
                      const isUnavailable = isSubtotalTooLow || isNotFirstOrder;
                      
                      return (
                        <div
                          key={coupon.code}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            isApplied 
                              ? "bg-forest-50 border-forest-300 shadow-sm" 
                              : isUnavailable
                              ? "bg-stone-50 border-stone-200 opacity-60" 
                              : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`inline-block text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                  isApplied 
                                    ? "bg-forest-600 text-white" 
                                    : "bg-stone-100 text-stone-800"
                                }`}>
                                  {coupon.code}
                                </span>
                                {coupon.minOrderValue && (
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                    Min: ₹{coupon.minOrderValue}
                                  </span>
                                )}
                                {coupon.code === "FREESHIP" && (
                                  <span className="text-[10px] font-bold text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded border border-forest-100">
                                    First order only
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-600 font-medium mt-1.5 leading-relaxed font-body">
                                {coupon.description}
                              </p>
                            </div>
                            
                            <div>
                              {isApplied ? (
                                <span className="text-xs font-bold text-forest-700 bg-forest-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                  Applied
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => handleApplyCoupon(coupon.code)}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                    isUnavailable
                                      ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                      : "bg-stone-900 text-white hover:bg-forest-700 active:scale-95"
                                  }`}
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {isSubtotalTooLow && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-0.5">
                              Add ₹{coupon.minOrderValue! - totalPrice} more to unlock this offer
                            </p>
                          )}
                          {isNotFirstOrder && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-0.5">
                              Valid for first order only
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t bg-stone-50/50 space-y-3" style={{ borderColor: "var(--color-stone-200)" }}>
              {(() => {
                const totalInclGst = totalPrice;
                const totalExGst = items.reduce((acc, item) => acc + ((item.price * item.quantity) / 1.05), 0);
                const totalGst = totalInclGst - totalExGst;
                const cgst = totalGst / 2;
                const sgst = totalGst / 2;
                
                const exactSubTotal = totalExGst;
                const roundedTotal = Math.round(finalTotal);
                const roundOff = roundedTotal - finalTotal;
                
                return (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Sub Total</span>
                      <span className="font-bold text-stone-800">₹{exactSubTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Discount {appliedCoupon && <span className="text-xs">({appliedCoupon.code})</span>}</span>
                      <span className="font-bold text-stone-800">₹{discountAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-stone-500">
                      <span>SGST@2.50%</span>
                      <span className="font-medium text-stone-800">₹{sgst.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-stone-500">
                      <span>CGST@2.50%</span>
                      <span className="font-medium text-stone-800">₹{cgst.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-stone-500">
                      <span>Shipping</span>
                      <span className="font-medium text-stone-800">
                        {shippingCost === 0 ? "₹0.00" : `₹${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-stone-500">
                      <span>Round Off</span>
                      <span className="font-medium text-stone-800">₹{roundOff.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 mt-2 border-t flex justify-between items-center" style={{ borderColor: "var(--color-stone-200)" }}>
                      <span className="text-sm font-bold text-stone-900">Total Amount</span>
                      <span className="text-sm font-bold text-stone-800">
                        ₹{roundedTotal.toFixed(2)}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
