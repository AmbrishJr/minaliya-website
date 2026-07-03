"use client";

import { motion } from "framer-motion";

interface GrowthChartProps {
  data: Array<{
    month: string;
    value: number;
  }>;
  label: string;
  color: string;
  isCurrency?: boolean;
}

export default function GrowthChart({ data, label, color, isCurrency = false }: GrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-xl border" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
        <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = 200;
  const chartWidth = 400;
  const barWidth = (chartWidth / data.length) * 0.6;
  const gap = (chartWidth / data.length) * 0.4;

  const formatValue = (val: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val.toLocaleString("en-IN");
  };

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
      <h3 className="font-bold text-sm mb-4" style={{ color: "var(--color-stone-800)" }}>{label}</h3>
      <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
        <svg width="100%" height={chartHeight + 40} viewBox={`0 0 ${chartWidth + 60} ${chartHeight + 40}`}>
          {/* Y-axis labels */}
          {[0, 0.5, 1].map((ratio) => {
            const y = chartHeight - chartHeight * ratio;
            const value = Math.round(maxValue * ratio);
            return (
              <g key={ratio}>
                <text
                  x={chartWidth + 10}
                  y={y + 4}
                  className="text-xs"
                  style={{ fill: "var(--color-stone-400)" }}
                >
                  {formatValue(value)}
                </text>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="var(--color-stone-200)"
                  strokeWidth={1}
                  strokeDasharray="4"
                />
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
            const x = i * (barWidth + gap) + gap / 2;
            const y = chartHeight - barHeight;

            return (
              <g key={i}>
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  initial={{ height: 0, y: chartHeight }}
                  animate={{ height: barHeight, y }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  rx={4}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs"
                  style={{ fill: "var(--color-stone-600)" }}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
