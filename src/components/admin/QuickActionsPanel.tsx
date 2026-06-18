"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Plus,
  MessageSquare,
  ExternalLink,
  Package,
  ArrowRight,
  BarChart3,
} from "lucide-react";

interface QuickActionsPanelProps {
  pendingOrders: number;
  stockPercent: number;
  totalProducts: number;
}

const actions = [
  {
    label: "View analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "var(--color-indigo-600)",
    bg: "var(--color-indigo-50)",
  },
  {
    label: "View pending orders",
    href: "/admin/orders?status=active",
    icon: Clock,
    color: "var(--color-amber-600)",
    bg: "var(--color-amber-50)",
  },
  {
    label: "Add new product",
    href: "/admin/products",
    icon: Plus,
    color: "var(--color-forest-600)",
    bg: "var(--color-forest-50)",
  },
  {
    label: "Bulk inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
    color: "#e11d48",
    bg: "#fff1f2",
  },
  {
    label: "Visit storefront",
    href: "/",
    icon: ExternalLink,
    color: "var(--color-stone-600)",
    bg: "var(--color-stone-100)",
    external: true,
  },
];

export default function QuickActionsPanel({
  pendingOrders,
  stockPercent,
  totalProducts,
}: QuickActionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.32 }}
      className="rounded-2xl border p-5 sm:p-6 flex flex-col"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h3 className="font-bold text-stone-900 text-base mb-1">Quick Actions</h3>
      <p className="text-xs text-stone-500 mb-5">Jump to common admin tasks</p>

      {/* Real stock metric */}
      <div className="mb-5 p-4 rounded-xl border border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2 mb-2">
          <Package size={14} className="text-forest-600" />
          <span className="text-xs font-semibold text-stone-600">Inventory Health</span>
        </div>
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-stone-500">{stockPercent}% in stock</span>
          <span className="text-stone-800">{totalProducts} products</span>
        </div>
        <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--color-forest-600)" }}
            initial={{ width: 0 }}
            animate={{ width: `${stockPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
        {pendingOrders > 0 && (
          <p className="text-[11px] text-amber-700 font-semibold mt-2">
            {pendingOrders} order{pendingOrders !== 1 ? "s" : ""} need attention
          </p>
        )}
      </div>

      <div className="space-y-2 flex-1">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const content = (
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors cursor-pointer group"
              style={{ background: "white" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: action.bg, color: action.color }}
                >
                  <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-stone-700 truncate">
                  {action.label}
                </span>
              </div>
              <ArrowRight
                size={14}
                className="text-stone-300 group-hover:text-stone-500 shrink-0 transition-colors"
              />
            </motion.div>
          );

          if (action.external) {
            return (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={action.label} href={action.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
