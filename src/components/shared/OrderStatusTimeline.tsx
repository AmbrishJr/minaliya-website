"use client";

import { DELIVERY_STATUSES, getStatusConfig, isTerminalStatus } from "@/lib/order-status";
import { Check } from "lucide-react";

interface OrderStatusTimelineProps {
  status: string;
}

export default function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const currentStatus = status?.toUpperCase();
  const isTerminal = isTerminalStatus(currentStatus);

  const statusesToShow = isTerminal
    ? DELIVERY_STATUSES
    : DELIVERY_STATUSES.slice(
        0,
        DELIVERY_STATUSES.indexOf(currentStatus as typeof DELIVERY_STATUSES[number]) + 1
      );

  return (
    <div className="w-full">
      <div className="flex items-center gap-0 w-full">
        {statusesToShow.map((s, i) => {
          const config = getStatusConfig(s);
          const isActive = s === currentStatus;
          const isPast = DELIVERY_STATUSES.indexOf(s) <= DELIVERY_STATUSES.indexOf(currentStatus as typeof DELIVERY_STATUSES[number]);

          return (
            <div key={s} className="flex-1 flex flex-col items-center relative">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className="h-0.5 flex-1 -mr-2 -ml-2 z-0"
                    style={{
                      background: isPast ? config.textColor : "var(--color-stone-200)",
                    }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all shrink-0"
                  style={{
                    background: isPast ? config.textColor : "white",
                    border: `2px solid ${isPast ? config.textColor : "var(--color-stone-300)"}`,
                    color: isPast ? "white" : "var(--color-stone-400)",
                  }}
                >
                  {isPast ? (
                    <Check size={14} />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                {i < statusesToShow.length - 1 && (
                  <div
                    className="h-0.5 flex-1 -mr-2 -ml-2 z-0"
                    style={{
                      background: isPast && i < DELIVERY_STATUSES.indexOf(currentStatus as typeof DELIVERY_STATUSES[number])
                        ? getStatusConfig(DELIVERY_STATUSES[i + 1]).textColor
                        : "var(--color-stone-200)",
                    }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 text-center leading-tight max-w-[80px] ${
                  isActive ? "opacity-100" : isPast ? "opacity-70" : "opacity-40"
                }`}
                style={{ color: isPast ? config.textColor : "var(--color-stone-400)" }}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>

      {isTerminal && (
        <div className="mt-4 pt-3 border-t border-stone-200 text-center">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              background: getStatusConfig(currentStatus).bg,
              color: getStatusConfig(currentStatus).textColor,
            }}
          >
            {getStatusConfig(currentStatus).label}
          </span>
        </div>
      )}
    </div>
  );
}
