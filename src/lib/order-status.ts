import { CheckCircle, Clock, Package, Truck, MapPin, XCircle, RotateCcw, ThumbsUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type OrderStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderStatusConfig {
  value: OrderStatusValue;
  label: string;
  color: string;
  bg: string;
  border: string;
  textColor: string;
  icon: LucideIcon;
  /** Which statuses come before this one in the timeline */
  completedBy?: OrderStatusValue[];
}

export const ORDER_STATUSES: OrderStatusConfig[] = [
  {
    value: "PENDING",
    label: "Pending",
    color: "amber",
    bg: "#fffbeb",
    border: "#fde68a",
    textColor: "#b45309",
    icon: Clock,
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    color: "blue",
    bg: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    icon: ThumbsUp,
  },
  {
    value: "PROCESSING",
    label: "Processing",
    color: "indigo",
    bg: "#eef2ff",
    border: "#c7d2fe",
    textColor: "#4338ca",
    icon: Package,
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    color: "purple",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    textColor: "#7c3aed",
    icon: Truck,
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    color: "orange",
    bg: "#fff7ed",
    border: "#fed7aa",
    textColor: "#c2410c",
    icon: MapPin,
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "green",
    bg: "var(--color-forest-50)",
    border: "var(--color-forest-200)",
    textColor: "var(--color-forest-700)",
    icon: CheckCircle,
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    color: "red",
    bg: "#fff1f2",
    border: "#fecdd3",
    textColor: "#be123c",
    icon: XCircle,
  },
  {
    value: "RETURNED",
    label: "Returned",
    color: "rose",
    bg: "#fff1f2",
    border: "#fecdd3",
    textColor: "#9f1239",
    icon: RotateCcw,
  },
];

/** Look up a status config by its value */
export function getStatusConfig(status: string): OrderStatusConfig {
  const found = ORDER_STATUSES.find(
    (s) => s.value === status?.toUpperCase()
  );
  if (found) return found;
  return {
    value: status as OrderStatusValue,
    label: status,
    color: "stone",
    bg: "var(--color-stone-50)",
    border: "var(--color-stone-200)",
    textColor: "var(--color-stone-600)",
    icon: Clock,
  };
}

/** Statuses that represent a "completed" delivery flow */
export const DELIVERY_STATUSES: OrderStatusValue[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/** Terminal statuses — order cannot move forward from these */
export const TERMINAL_STATUSES: Set<OrderStatusValue> = new Set([
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
]);

/** Determine if a status is terminal (no further transitions expected) */
export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status?.toUpperCase() as OrderStatusValue);
}
