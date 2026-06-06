"use server";

import prisma from "@/lib/prisma";
import { verifyAdminSession } from "./admin";

async function requireAdmin() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }
}

function getMonthBounds(offsetMonths = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - offsetMonths + 1, 1);
  return { start, end };
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export type AnalyticsData = {
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
};

export async function getAnalyticsData(months: number = 6): Promise<AnalyticsData> {
  await requireAdmin();

  const now = new Date();
  const monthlySeries: AnalyticsData["monthlySeries"] = [];
  
  // Get monthly data for the specified period
  for (let i = months - 1; i >= 0; i--) {
    const { start, end } = getMonthBounds(i);
    const monthLabel = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    
    const [revenueAgg, orderCount] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lt: end },
          status: { not: "CANCELLED" },
        },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: start, lt: end },
          status: { not: "CANCELLED" },
        },
      }),
    ]);

    const revenue = Number(revenueAgg._sum.totalAmount ?? 0);
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    monthlySeries.push({
      month: monthLabel,
      revenue,
      orders: orderCount,
      avgOrderValue,
    });
  }

  // Calculate growth metrics
  const thisMonth = getMonthBounds(0);
  const lastMonth = getMonthBounds(1);
  
  const [revenueThisMonthAgg, revenueLastMonthAgg, ordersThisMonth, ordersLastMonth] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: thisMonth.start, lt: thisMonth.end },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonth.start, lt: lastMonth.end },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: thisMonth.start, lt: thisMonth.end },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: lastMonth.start, lt: lastMonth.end },
        status: { not: "CANCELLED" },
      },
    }),
  ]);

  const revenueThisMonth = Number(revenueThisMonthAgg._sum.totalAmount ?? 0);
  const revenueLastMonth = Number(revenueLastMonthAgg._sum.totalAmount ?? 0);
  const revenueTotal = monthlySeries.reduce((sum, m) => sum + m.revenue, 0);
  const ordersTotal = monthlySeries.reduce((sum, m) => sum + m.orders, 0);

  const revenueMoM = percentChange(revenueThisMonth, revenueLastMonth);
  const ordersMoM = percentChange(ordersThisMonth, ordersLastMonth);

  // Get period start date for category and product breakdowns
  const periodStart = getMonthBounds(months - 1).start;

  // Category breakdown
  const orderItemsWithCategory = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: periodStart },
        status: { not: "CANCELLED" },
      },
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  const categoryRevenueMap = new Map<string, number>();
  orderItemsWithCategory.forEach((item: any) => {
    const categoryName = item.product.category.name;
    const revenue = Number(item.price) * item.quantity;
    categoryRevenueMap.set(categoryName, (categoryRevenueMap.get(categoryName) || 0) + revenue);
  });

  const totalCategoryRevenue = Array.from(categoryRevenueMap.values()).reduce((sum, val) => sum + val, 0);
  const categoryBreakdown = Array.from(categoryRevenueMap.entries())
    .map(([name, revenue]) => ({
      name,
      revenue,
      sharePercent: totalCategoryRevenue > 0 ? Math.round((revenue / totalCategoryRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top products
  const productSalesMap = new Map<string, { unitsSold: number; revenue: number; name: string }>();
  orderItemsWithCategory.forEach((item: any) => {
    const productName = item.product.name;
    const units = item.quantity;
    const revenue = Number(item.price) * item.quantity;
    const existing = productSalesMap.get(productName) || { unitsSold: 0, revenue: 0, name: productName };
    productSalesMap.set(productName, {
      unitsSold: existing.unitsSold + units,
      revenue: existing.revenue + revenue,
      name: productName,
    });
  });

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(({ name, unitsSold, revenue }) => ({ name, unitsSold, revenue }));

  // Status breakdown
  const statusBreakdownRaw = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusBreakdown = statusBreakdownRaw.map((s: any) => ({
    status: s.status,
    count: s._count,
  }));

  // Inventory alerts
  const inventoryAlerts = await prisma.product.findMany({
    where: {
      stock: { lte: 10 },
    },
    select: {
      name: true,
      stock: true,
      slug: true,
    },
    orderBy: {
      stock: "asc",
    },
  });

  // Bulk inquiry highlights (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentInquiries = await prisma.bulkInquiry.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  const inquiryMap = new Map<string, { totalQuantity: number; count: number }>();
  recentInquiries.forEach((inquiry: any) => {
    const product = inquiry.product;
    const existing = inquiryMap.get(product) || { totalQuantity: 0, count: 0 };
    inquiryMap.set(product, {
      totalQuantity: existing.totalQuantity + inquiry.quantity,
      count: existing.count + 1,
    });
  });

  const inquiryHighlights = Array.from(inquiryMap.entries())
    .map(([product, { totalQuantity, count }]) => ({ product, totalQuantity, count }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  // Generate recommendations
  const recommendations: AnalyticsData["recommendations"] = [];
  const pendingOrders = statusBreakdown.find((s: any) => s.status === "PENDING")?.count || 0;
  const processingOrders = statusBreakdown.find((s: any) => s.status === "PROCESSING")?.count || 0;
  const totalPending = pendingOrders + processingOrders;
  const cancelledOrders = statusBreakdown.find((s: any) => s.status === "CANCELLED")?.count || 0;
  const totalOrders = statusBreakdown.reduce((sum: number, s: any) => sum + s.count, 0);

  // High priority recommendations
  if (totalPending > 0) {
    recommendations.push({
      id: "process-pending",
      priority: "high",
      title: "Process pending orders",
      detail: `${totalPending} order${totalPending > 1 ? "s" : ""} awaiting processing`,
      href: "/admin/orders?status=active",
      cta: "View orders",
    });
  }

  const outOfStockProducts = inventoryAlerts.filter((p: any) => p.stock === 0);
  if (outOfStockProducts.length > 0) {
    recommendations.push({
      id: "restock-products",
      priority: "high",
      title: "Restock products",
      detail: `${outOfStockProducts.length} product${outOfStockProducts.length > 1 ? "s" : ""} out of stock`,
      href: "/admin/products",
      cta: "Manage inventory",
    });
  }

  // Medium priority recommendations
  const lowStockProducts = inventoryAlerts.filter((p: any) => p.stock > 0 && p.stock <= 10);
  if (lowStockProducts.length > 0) {
    recommendations.push({
      id: "low-stock",
      priority: "medium",
      title: "Low stock alert",
      detail: `${lowStockProducts.length} product${lowStockProducts.length > 1 ? "s" : ""} running low (≤10 units)`,
      href: "/admin/products",
      cta: "View products",
    });
  }

  if (revenueMoM !== null && revenueMoM < -10) {
    recommendations.push({
      id: "revenue-decline",
      priority: "medium",
      title: "Revenue declined",
      detail: `Revenue down ${Math.abs(revenueMoM)}% vs last month—review pricing or featured products`,
      href: "/admin/products",
      cta: "Review products",
    });
  }

  if (cancelledOrders > 0 && totalOrders > 0 && (cancelledOrders / totalOrders) > 0.2) {
    recommendations.push({
      id: "high-cancellation",
      priority: "medium",
      title: "High cancellation rate",
      detail: `${Math.round((cancelledOrders / totalOrders) * 100)}% of orders cancelled—review checkout flow`,
      href: "/admin/orders",
      cta: "View orders",
    });
  }

  const highDemandInquiries = inquiryHighlights.filter((i) => i.count >= 2);
  if (highDemandInquiries.length > 0) {
    recommendations.push({
      id: "bulk-demand",
      priority: "medium",
      title: "Strong bulk demand",
      detail: `Multiple inquiries for ${highDemandInquiries[0].product}—consider bulk pricing`,
      href: "/admin/inquiries",
      cta: "View inquiries",
    });
  }

  // Low priority recommendations
  if (revenueMoM !== null && revenueMoM > 15) {
    const topProduct = topProducts[0];
    recommendations.push({
      id: "revenue-growth",
      priority: "low",
      title: "Revenue growing",
      detail: `Revenue up ${revenueMoM}%—consider promoting ${topProduct?.name || "top products"}`,
      href: "/admin/products",
      cta: "View products",
    });
  }

  if (categoryBreakdown.length > 0 && categoryBreakdown[0].sharePercent > 60) {
    recommendations.push({
      id: "category-dominance",
      priority: "low",
      title: "Category concentration",
      detail: `${categoryBreakdown[0].name} drives ${categoryBreakdown[0].sharePercent}% of sales—ensure stock coverage`,
      href: "/admin/products",
      cta: "View products",
    });
  }

  // If no recommendations, add neutral message
  if (recommendations.length === 0) {
    recommendations.push({
      id: "healthy-store",
      priority: "low",
      title: "Store is healthy",
      detail: "No urgent actions needed—operations running smoothly",
      href: "/admin",
      cta: "View dashboard",
    });
  }

  return {
    periodLabel: `Last ${months} month${months > 1 ? "s" : ""}`,
    monthlySeries,
    growth: {
      revenueMoM,
      ordersMoM,
      revenueTotal,
      ordersTotal,
    },
    categoryBreakdown,
    topProducts,
    statusBreakdown,
    inventoryAlerts,
    inquiryHighlights,
    recommendations,
  };
}
