"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-cream-50)" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-red-100)" }}>
          <XCircle size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Payment Failed
        </h1>
        <p className="text-stone-500 mb-8">
          Something went wrong with your payment. Please try again or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="px-8 py-3 rounded-xl font-bold text-white transition-all"
            style={{ background: "var(--color-forest-600)" }}
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 rounded-xl font-bold transition-all"
            style={{ background: "var(--color-stone-200)", color: "var(--color-stone-800)" }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
