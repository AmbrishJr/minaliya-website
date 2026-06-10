"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("razorpay_payment_id");

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-cream-50)" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-forest-100)" }}>
          <CheckCircle2 size={48} className="text-forest-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Payment Successful!
        </h1>
        <p className="text-stone-500 mb-2">Your payment has been processed successfully.</p>
        {paymentId && (
          <p className="text-sm font-mono mb-8 p-3 rounded-lg" style={{ background: "var(--color-stone-100)", color: "var(--color-stone-600)" }}>
            Payment ID: {paymentId}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="px-8 py-3 rounded-xl font-bold text-white transition-all"
            style={{ background: "var(--color-forest-600)" }}
          >
            Go to Orders
          </Link>
          <Link
            href="/"
            className="px-8 py-3 rounded-xl font-bold transition-all"
            style={{ background: "var(--color-stone-200)", color: "var(--color-stone-800)" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
