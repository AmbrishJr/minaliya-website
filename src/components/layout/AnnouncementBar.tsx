"use client";

import { useState, useEffect } from "react";
import { X, Truck, Phone, CreditCard } from "lucide-react";
import { getDefaultHeaderSettings } from "@/lib/header-defaults";
import type { HeaderSettingsData } from "@/actions/adminData";

const iconMap: Record<string, React.ReactNode> = {
  truck: <Truck size={14} />,
  "credit-card": <CreditCard size={14} />,
  phone: <Phone size={14} />,
};

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [settings, setSettings] = useState<HeaderSettingsData | null>(null);

  useEffect(() => {
    fetch("/api/header-settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(getDefaultHeaderSettings()));
  }, []);

  if (!visible) return null;

  const s = settings ?? getDefaultHeaderSettings();

  const announcements: { icon?: React.ReactNode; text: string; href?: string }[] = [];

  if (s.announcement1.enabled) {
    announcements.push({
      icon: iconMap[s.announcement1.icon] ?? undefined,
      text: s.announcement1.text,
    });
  }
  if (s.announcement2.enabled) {
    announcements.push({
      icon: iconMap[s.announcement2.icon] ?? undefined,
      text: s.announcement2.text,
    });
  }
  if (s.announcement3.enabled) {
    announcements.push({
      icon: iconMap.phone,
      text: `${s.announcement3.label} ${s.announcement3.phone}`,
      href: `https://wa.me/${s.announcement3.phone.replace(/\D/g, "")}`,
    });
  }
  if (s.announcement4.enabled) {
    announcements.push({
      icon: iconMap[s.announcement4.icon] ?? undefined,
      text: s.announcement4.text,
    });
  }
  if (s.extraAnnouncements && Array.isArray(s.extraAnnouncements)) {
    for (const extra of s.extraAnnouncements) {
      if (extra.enabled) {
        announcements.push({
          icon: iconMap[extra.icon] ?? undefined,
          text: extra.text,
        });
      }
    }
  }

  if (announcements.length === 0) return null;

  return (
    <div
      id="announcement-bar"
      className="relative overflow-hidden"
      style={{ background: "var(--color-forest-700)", color: "var(--color-cream-100)" }}
    >
      <div className="flex items-center justify-center py-2 px-4">
        <div className="overflow-hidden max-w-5xl w-full">
          <div className="flex animate-scroll-left whitespace-nowrap gap-12 items-center">
            {[...announcements, ...announcements].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase"
                style={{ color: "var(--color-cream-200)" }}
              >
                {item.icon}
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
                <span className="mx-4 opacity-30">•</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
