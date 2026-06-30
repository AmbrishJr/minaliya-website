import { getStatusConfig } from "@/lib/order-status";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider"
      style={{
        backgroundColor: config.bg,
        color: config.textColor,
        borderColor: config.border,
      }}
    >
      {config.label}
    </span>
  );
}
