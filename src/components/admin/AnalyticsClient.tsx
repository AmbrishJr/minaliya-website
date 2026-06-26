"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getAnalyticsData } from "@/actions/analytics";
import GrowthChart from "./GrowthChart";
import RecommendationsPanel from "./RecommendationsPanel";
import InteractiveStatCard from "./InteractiveStatCard";
import { TrendingUp, ShoppingBag, DollarSign, Package, AlertCircle, MessageSquare } from "lucide-react";

interface AnalyticsData {
  periodLabel: string;
  monthlySeries: Array<{
    month: string;
    revenue: number;
    orders: number;
    avgOrderValue: number;
  }>;
  growth: {
    revenueMoM: number | null;
    ordersMoM: number | null;
    revenueTotal: number;
    ordersTotal: number;
  };
  categoryBreakdown: Array<{ name: string; revenue: number; sharePercent: number }>;
  topProducts: Array<{ name: string; unitsSold: number; revenue: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  inventoryAlerts: Array<{ name: string; stock: number; slug: string }>;
  inquiryHighlights: Array<{ product: string; totalQuantity: number; count: number }>;
  recommendations: Array<{
    id: string;
    priority: "high" | "medium" | "low";
    title: string;
    detail: string;
    href: string;
    cta: string;
  }>;
}

interface AnalyticsClientProps {
  initialData: AnalyticsData;
}

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const [data, setData] = useState(initialData);
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = async (newMonths: number) => {
    if (newMonths === months) return;
    
    setLoading(true);
    setMonths(newMonths);
    try {
      const newData = await getAnalyticsData(newMonths);
      setData(newData);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasOrders = data.growth.ordersTotal > 0;
  const hasInsufficientData = data.monthlySeries.filter((m) => m.orders > 0).length < 2;

  if (!hasOrders) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border p-8" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-stone-100)" }}>
          <ShoppingBag size={32} style={{ color: "var(--color-stone-400)" }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>Zero orders</h3>
        <p className="text-sm text-center" style={{ color: "var(--color-stone-500)" }}>
          No orders have been placed yet. Start by adding products and promoting your store.
        </p>
      </div>
    );
  }

  if (hasInsufficientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border p-8" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-amber-100)" }}>
          <AlertCircle size={32} style={{ color: "var(--color-amber-600)" }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>Not enough order history yet</h3>
        <p className="text-sm text-center" style={{ color: "var(--color-stone-500)" }}>
          Need at least 2 months of order data to show growth trends and analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-stone-900)" }}>
            Analytics Dashboard
          </h2>
          <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
            Track your store&apos;s performance and growth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--color-stone-600)" }}>
            Period:
          </label>
          <select
            value={months}
            onChange={(e) => handlePeriodChange(Number(e.target.value))}
            disabled={loading}
            className="px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 transition-colors"
            style={{
              borderColor: "var(--color-stone-200)",
              background: "white",
              color: "var(--color-stone-800)",
            }}
          >
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </div>
      </motion.div>

      {/* Growth Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InteractiveStatCard
          title="Total Revenue"
          value={data.growth.revenueTotal}
          icon={DollarSign}
          href="/admin/orders"
          color="forest"
          trend={data.growth.revenueMoM}
          index={0}
          isCurrency
        />
        <InteractiveStatCard
          title="Total Orders"
          value={data.growth.ordersTotal}
          icon={ShoppingBag}
          href="/admin/orders"
          color="indigo"
          trend={data.growth.ordersMoM}
          index={1}
        />
        <InteractiveStatCard
          title="Avg Order Value"
          value={data.monthlySeries.reduce((sum, m) => sum + m.avgOrderValue, 0) / data.monthlySeries.length}
          icon={TrendingUp}
          href="/admin/orders"
          color="amber"
          index={2}
          isCurrency
        />
        <InteractiveStatCard
          title="Products"
          value={data.topProducts.length}
          icon={Package}
          href="/admin/products"
          color="rose"
          index={3}
        />
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthChart
          data={data.monthlySeries.map((m) => ({ month: m.month, value: m.revenue }))}
          label="Revenue by Month"
          color="var(--color-forest-600)"
          isCurrency
        />
        <GrowthChart
          data={data.monthlySeries.map((m) => ({ month: m.month, value: m.orders }))}
          label="Orders by Month"
          color="var(--color-indigo-600)"
        />
      </div>

      {/* Category Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "white",
            borderColor: "var(--color-stone-200)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3 className="font-bold text-base mb-4" style={{ color: "var(--color-stone-900)" }}>
            Category Revenue Share
          </h3>
          {data.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.categoryBreakdown.map((cat, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: "var(--color-stone-700)" }}>{cat.name}</span>
                    <span className="font-semibold" style={{ color: "var(--color-stone-900)" }}>
                      {cat.sharePercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--color-stone-200)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--color-forest-600)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.sharePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>No category data available</p>
          )}
        </motion.div>

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
          <h3 className="font-bold text-base mb-4" style={{ color: "var(--color-stone-900)" }}>
            Top 5 Products
          </h3>
          {data.topProducts.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: "var(--color-stone-200)", background: "var(--color-stone-50)" }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-stone-800)" }}>
                      {product.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-stone-500)" }}>
                      {product.unitsSold} units sold
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "var(--color-forest-600)" }}>
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>No product sales data available</p>
          )}
        </motion.div>
      </div>

      {/* Recommendations Panel */}
      <RecommendationsPanel recommendations={data.recommendations} />

      {/* Operational Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: "white",
          borderColor: "var(--color-stone-200)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3 className="font-bold text-base mb-4" style={{ color: "var(--color-stone-900)" }}>
          Operational Snapshot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Status Breakdown */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-stone-700)" }}>
              Order Status
            </h4>
            <div className="space-y-2">
              {data.statusBreakdown.map((status) => (
                <div key={status.status} className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-stone-600)" }}>{status.status}</span>
                  <span className="font-semibold" style={{ color: "var(--color-stone-900)" }}>
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-stone-700)" }}>
              Inventory Alerts
            </h4>
            {data.inventoryAlerts.length > 0 ? (
              <div className="space-y-2">
                {data.inventoryAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.slug} className="flex justify-between text-sm">
                    <span className="truncate" style={{ color: "var(--color-stone-600)" }}>
                      {alert.name}
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color: alert.stock === 0 ? "var(--color-amber-600)" : "var(--color-stone-900)",
                      }}
                    >
                      {alert.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>No inventory alerts</p>
            )}
          </div>

          {/* Bulk Inquiry Highlights */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--color-stone-700)" }}>
              <MessageSquare size={14} />
              Bulk Inquiries (30d)
            </h4>
            {data.inquiryHighlights.length > 0 ? (
              <div className="space-y-2">
                {data.inquiryHighlights.map((inquiry, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="truncate" style={{ color: "var(--color-stone-600)" }}>
                      {inquiry.product}
                    </span>
                    <span className="font-semibold" style={{ color: "var(--color-stone-900)" }}>
                      {inquiry.count} req
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-stone-400)" }}>No recent inquiries</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
