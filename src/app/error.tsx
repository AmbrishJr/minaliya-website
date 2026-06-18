"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-cream-50)" }}
    >
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "var(--color-terra-50)",
            border: "1px solid var(--color-terra-200)",
          }}
        >
          <span className="text-3xl font-bold" style={{ color: "var(--color-terra-500)" }}>
            !
          </span>
        </div>

        <div className="divider-leaf mx-auto mb-6" />

        <h1
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}
        >
          Something Went Wrong
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed mb-8"
          style={{ color: "var(--color-stone-500)" }}
        >
          We encountered an unexpected error. Please try again, or return home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="btn-primary text-sm px-6 py-3.5"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary text-sm px-6 py-3.5"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p
            className="text-xs mt-8"
            style={{ color: "var(--color-stone-400)" }}
          >
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
