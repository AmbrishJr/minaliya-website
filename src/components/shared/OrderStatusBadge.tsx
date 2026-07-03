import { getStatusConfig } from "@/lib/order-status";

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const config = getStatusConfig(status);

  const sizeClasses = size === "md"
    ? "px-3 py-1 text-xs"
    : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full ${sizeClasses}`}
      style={{
        backgroundColor: config.bg,
        color: config.textColor,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}
