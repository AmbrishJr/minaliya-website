"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getDefaultSiteSettings } from "@/lib/site-defaults";
import type { SiteSettingsData } from "@/actions/adminData";

export default function StoreModeBanner() {
  const [visible, setVisible] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(getDefaultSiteSettings()));
  }, []);

  if (!visible) return null;

  const s = settings ?? getDefaultSiteSettings();
  if (s.storeMode !== "OFFLINE") return null;

  return (
    <div
      className="relative w-full"
      style={{ background: "var(--color-amber-600)", color: "#fff" }}
    >
      <div className="flex items-center justify-center py-2 px-8 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wide">
          Our store is temporarily offline — you can browse, but new orders are paused right now.
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close offline notice"
      >
        <X size={14} />
      </button>
    </div>
  );
}
