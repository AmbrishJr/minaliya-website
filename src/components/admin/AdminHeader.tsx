"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, ExternalLink, Power, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateSiteSettings } from "@/actions/adminData";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title: string;
  storeMode: "LIVE" | "OFFLINE";
}

export default function AdminHeader({ onMenuToggle, title, storeMode }: AdminHeaderProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"LIVE" | "OFFLINE">(storeMode);
  const [toggling, setToggling] = useState(false);

  const isLive = mode === "LIVE";

  const handleToggle = async () => {
    const next: "LIVE" | "OFFLINE" = isLive ? "OFFLINE" : "LIVE";
    const message = isLive
      ? "Switch store to OFFLINE mode?\n\nUsers can still browse the site, but they will NOT be able to place orders."
      : "Switch store to LIVE mode?\n\nUsers will be able to place orders again.";
    if (!confirm(message)) return;

    setToggling(true);
    try {
      const res = await updateSiteSettings({ storeMode: next });
      if (res.success) {
        setMode(next);
        router.refresh();
      } else {
        alert(res.error || "Failed to update store mode.");
      }
    } catch {
      alert("Failed to update store mode. Please try again.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--color-stone-200)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg lg:hidden transition-colors"
          aria-label="Toggle menu"
          style={{ color: "var(--color-stone-500)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-stone-800)"; e.currentTarget.style.background = "var(--color-stone-100)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-stone-500)"; e.currentTarget.style.background = "transparent"; }}
        >
          <Menu size={20} />
        </button>

        <h1
          className="text-sm sm:text-lg font-bold tracking-wide truncate max-w-[180px] sm:max-w-none"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Visit Store — opens in new tab */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit storefront"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            color: "var(--color-forest-700)",
            background: "var(--color-forest-50)",
            border: "1px solid var(--color-forest-100)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-forest-600)";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "var(--color-forest-600)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-forest-50)";
            e.currentTarget.style.color = "var(--color-forest-700)";
            e.currentTarget.style.borderColor = "var(--color-forest-100)";
          }}
        >
          <ExternalLink size={12} />
          <span className="hidden sm:inline">Visit Store</span>
        </Link>

        {/* LIVE / OFFLINE Toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={isLive ? "Click to go OFFLINE (users can't order)" : "Click to go LIVE (orders enabled)"}
          aria-label="Toggle store mode"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-60"
          style={{
            background: isLive ? "var(--color-forest-50)" : "var(--color-terra-50)",
            border: isLive ? "1px solid var(--color-forest-100)" : "1px solid var(--color-terra-200)",
            cursor: toggling ? "wait" : "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
        >
          {toggling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: isLive ? "var(--color-forest-400)" : "var(--color-terra-400)" }}
              ></span>
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: isLive ? "var(--color-forest-500)" : "var(--color-terra-500)" }}
              ></span>
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: isLive ? "var(--color-forest-600)" : "var(--color-terra-500)" }}
          >
            {isLive ? "Live Mode" : "Offline Mode"}
          </span>
          <Power size={11} style={{ color: isLive ? "var(--color-forest-500)" : "var(--color-terra-500)" }} />
        </button>
      </div>
    </header>
  );
}
