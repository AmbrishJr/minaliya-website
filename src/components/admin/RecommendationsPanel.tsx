"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
  href: string;
  cta: string;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    bg: "var(--color-amber-50)",
    border: "var(--color-amber-200)",
    text: "var(--color-amber-700)",
    badge: "var(--color-amber-100)",
    badgeText: "var(--color-amber-800)",
  },
  medium: {
    icon: Info,
    bg: "var(--color-stone-50)",
    border: "var(--color-stone-200)",
    text: "var(--color-stone-700)",
    badge: "var(--color-stone-100)",
    badgeText: "var(--color-stone-800)",
  },
  low: {
    icon: CheckCircle,
    bg: "#ecfdf5",
    border: "#a7f3d0",
    text: "#059669",
    badge: "#d1fae5",
    badgeText: "#065f46",
  },
};

export default function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h3 className="font-bold text-base mb-1" style={{ color: "var(--color-stone-900)" }}>
        Recommendations
      </h3>
      <p className="text-xs mb-5" style={{ color: "var(--color-stone-500)" }}>
        Data-driven insights to improve your store
      </p>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const config = priorityConfig[rec.priority];
          const Icon = config.icon;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
            >
              <Link
                href={rec.href}
                className="block group focus:outline-none"
              >
                <div
                  className="p-4 rounded-xl border transition-all duration-200 hover:shadow-md"
                  style={{
                    background: config.bg,
                    borderColor: config.border,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: config.badge, color: config.badgeText }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: config.badge,
                            color: config.badgeText,
                          }}
                        >
                          {rec.priority}
                        </span>
                        <h4 className="text-sm font-semibold" style={{ color: config.text }}>
                          {rec.title}
                        </h4>
                      </div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-stone-600)" }}>
                        {rec.detail}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: config.text }}>
                        {rec.cta}
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
