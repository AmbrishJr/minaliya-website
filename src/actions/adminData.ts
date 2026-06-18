"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/product-utils";
import { verifyAdminSession } from "./admin";

export type CreateProductInput = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  price: number;
  discountPrice?: number | null;
  stock?: number;
  images: string[];
  isFeatured?: boolean;
};

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

export async function getAdminDashboardStats() {
  await requireAdmin();

  const thisMonth = getMonthBounds(0);
  const lastMonth = getMonthBounds(1);

  const [
    totalOrders,
    totalProducts,
    totalInquiries,
    revenueAgg,
    pendingOrders,
    inStockCount,
    ordersThisMonth,
    ordersLastMonth,
    revenueThisMonthAgg,
    revenueLastMonthAgg,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.bulkInquiry.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
    }),
    prisma.product.count({ where: { stock: { gt: 0 } } }),
    prisma.order.count({
      where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalRevenue = Number(revenueAgg._sum.totalAmount ?? 0);
  const revenueThisMonth = Number(revenueThisMonthAgg._sum.totalAmount ?? 0);
  const revenueLastMonth = Number(revenueLastMonthAgg._sum.totalAmount ?? 0);

  const ordersTrend = percentChange(ordersThisMonth, ordersLastMonth);
  const revenueTrend = percentChange(revenueThisMonth, revenueLastMonth);

  const stockPercent =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;

  return {
    totalOrders,
    totalProducts,
    totalInquiries,
    totalRevenue,
    pendingOrders,
    stockPercent,
    ordersTrend,
    revenueTrend,
  };
}

export async function getAllOrders() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress as Record<string, string>,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    customerName: (order.shippingAddress as Record<string, string>)?.name || "N/A",
    customerEmail: (order.shippingAddress as Record<string, string>)?.email || "N/A",
    customerPhone: (order.shippingAddress as Record<string, string>)?.phone || "N/A",
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      productImage: item.product.images[0] || "/products/placeholder.jpg",
      quantity: item.quantity,
      price: Number(item.price),
    })),
  }));
}

export async function getAllProducts() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    stock: product.stock,
    images: product.images,
    isFeatured: product.isFeatured,
    categoryName: product.category.name,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
  }));
}

export async function getAllCategories() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return categories;
}

export async function createProduct(input: CreateProductInput) {
  await requireAdmin();

  const name = input.name?.trim();
  const slug = slugify(input.slug || input.name || "");
  const description = input.description?.trim();
  const categoryId = input.categoryId?.trim();
  const images = input.images?.filter((p) => p.startsWith("/"));

  if (!name || !slug || !description || !categoryId) {
    return {
      success: false as const,
      error: "Name, slug, description, and category are required.",
    };
  }

  if (!images?.length) {
    return {
      success: false as const,
      error: "At least one product image is required.",
    };
  }

  const price = Number(input.price);

  if (!Number.isFinite(price) || price <= 0) {
    return { success: false as const, error: "Price must be a positive number." };
  }

  const stock =
    input.stock != null ? Number(input.stock) : 100;

  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false as const, error: "Stock must be a whole number of 0 or more." };
  }

  const discountPrice =
    input.discountPrice != null ? Number(input.discountPrice) : null;

  if (discountPrice != null && (!Number.isFinite(discountPrice) || discountPrice <= 0)) {
    return { success: false as const, error: "Discount price must be a positive number." };
  }

  if (discountPrice != null && discountPrice > price) {
    return {
      success: false as const,
      error: "Discount price cannot be higher than the regular price.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { success: false as const, error: "Selected category does not exist." };
  }

  const existingSlug = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    return {
      success: false as const,
      error: `A product with slug "${slug}" already exists. Choose a different slug.`,
    };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        price,
        discountPrice: discountPrice ?? undefined,
        stock,
        images,
        isFeatured: input.isFeatured ?? false,
      },
    });

    return { success: true as const, productId: product.id };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return {
        success: false as const,
        error: "A product with this slug already exists.",
      };
    }
    return { success: false as const, error: "Failed to create product." };
  }
}

export async function getAllInquiries() {
  await requireAdmin();

  const inquiries = await prisma.bulkInquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return inquiries.map((inquiry: any) => ({
    id: inquiry.id,
    name: inquiry.name,
    company: inquiry.company,
    email: inquiry.email,
    phone: inquiry.phone,
    product: inquiry.product,
    quantity: inquiry.quantity,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
  }));
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  await requireAdmin();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function getRecentOrders(limit = 10) {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    customerName: (order.shippingAddress as Record<string, string>)?.name || "N/A",
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.reduce((sum: number, item) => sum + item.quantity, 0),
  }));
}

export async function updateProduct(id: string, input: CreateProductInput) {
  await requireAdmin();

  const name = input.name?.trim();
  const slug = slugify(input.slug || input.name || "");
  const description = input.description?.trim();
  const categoryId = input.categoryId?.trim();
  const images = input.images?.filter((p) => p.startsWith("/"));

  if (!name || !slug || !description || !categoryId) {
    return {
      success: false as const,
      error: "Name, slug, description, and category are required.",
    };
  }

  if (!images?.length) {
    return {
      success: false as const,
      error: "At least one product image is required.",
    };
  }

  const price = Number(input.price);

  if (!Number.isFinite(price) || price <= 0) {
    return { success: false as const, error: "Price must be a positive number." };
  }

  const stock = input.stock != null ? Number(input.stock) : 100;

  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false as const, error: "Stock must be a whole number of 0 or more." };
  }

  const discountPrice = input.discountPrice != null ? Number(input.discountPrice) : null;

  if (discountPrice != null && (!Number.isFinite(discountPrice) || discountPrice <= 0)) {
    return { success: false as const, error: "Discount price must be a positive number." };
  }

  if (discountPrice != null && discountPrice > price) {
    return {
      success: false as const,
      error: "Discount price cannot be higher than the regular price.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { success: false as const, error: "Selected category does not exist." };
  }

  const existingSlugProduct = await prisma.product.findFirst({
    where: {
      slug,
      id: { not: id },
    },
  });

  if (existingSlugProduct) {
    return {
      success: false as const,
      error: `A product with slug "${slug}" already exists. Choose a different slug.`,
    };
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        categoryId,
        price,
        discountPrice: discountPrice ?? null,
        stock,
        images,
        isFeatured: input.isFeatured ?? false,
      },
    });

    return { success: true as const, productId: product.id };
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    return { success: false as const, error: "Failed to update product." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  try {
    // 1. Find all order items for this product
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: id },
      select: { orderId: true },
    });

    const orderIds = Array.from(new Set(orderItems.map((item) => item.orderId)));

    // 2. Delete all order items belonging to those orders
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: orderIds } },
    });

    // 3. Delete the parent orders
    await prisma.order.deleteMany({
      where: { id: { in: orderIds } },
    });

    // 4. Finally delete the product
    await prisma.product.delete({
      where: { id },
    });
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error deleting product:", error);
    return { success: false as const, error: "Failed to delete product." };
  }
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();

  try {
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });
    await prisma.order.delete({
      where: { id: orderId },
    });
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error deleting order:", error);
    return { success: false as const, error: "Failed to delete order." };
  }
}

export async function deleteInquiry(inquiryId: string) {
  await requireAdmin();

  try {
    await prisma.bulkInquiry.delete({
      where: { id: inquiryId },
    });
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error deleting inquiry:", error);
    return { success: false as const, error: "Failed to delete inquiry." };
  }
}

// ─── HERO SLIDES ────────────────────────────────────────

export async function getHeroSlides() {
  await requireAdmin();

  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return slides.map((s) => ({
    ...s,
    headline: s.headline as { text: string; style: "display" | "serif-italic" | "sans" }[],
  }));
}

export async function getActiveHeroSlides() {
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return slides.map((s) => ({
    id: s.id,
    label: s.label,
    headlineParts: s.headline as { text: string; style: "display" | "serif-italic" | "sans" }[],
    subtitle: s.subtitle,
    image: s.image,
    imageAlt: s.imageAlt,
    accentColor: s.accentColor,
    badge: s.badge ?? "",
    bg: {
      primary: s.bgPrimary,
      secondary: s.bgSecondary,
      accent: s.bgAccent,
    },
  }));
}

export async function createHeroSlide(input: {
  label: string;
  headline: { text: string; style: "display" | "serif-italic" | "sans" }[];
  subtitle: string;
  image: string;
  imageAlt: string;
  accentColor?: string;
  badge?: string;
  bgPrimary?: string;
  bgSecondary?: string;
  bgAccent?: string;
  sortOrder?: number;
}) {
  await requireAdmin();

  const label = input.label?.trim();
  if (!label) return { success: false as const, error: "Label is required." };

  const headline = input.headline;
  if (!headline?.length) return { success: false as const, error: "At least one headline part is required." };

  const subtitle = input.subtitle?.trim();
  if (!subtitle) return { success: false as const, error: "Subtitle is required." };

  const image = input.image?.trim();
  if (!image) return { success: false as const, error: "Image URL is required." };

  const imageAlt = input.imageAlt?.trim();
  if (!imageAlt) return { success: false as const, error: "Image alt text is required." };

  const maxOrder = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } });
  const nextSortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  try {
    const slide = await prisma.heroSlide.create({
      data: {
        label,
        headline,
        subtitle,
        image,
        imageAlt,
        accentColor: input.accentColor ?? "#C47700",
        badge: input.badge ?? null,
        bgPrimary: input.bgPrimary ?? "#FFFFFF",
        bgSecondary: input.bgSecondary ?? "#F9F9F9",
        bgAccent: input.bgAccent ?? "#FFFFFF",
        sortOrder: input.sortOrder ?? nextSortOrder,
      },
    });
    return { success: true as const, slideId: slide.id };
  } catch (error: unknown) {
    console.error("Error creating hero slide:", error);
    return { success: false as const, error: "Failed to create hero slide." };
  }
}

export async function updateHeroSlide(
  id: string,
  input: {
    label?: string;
    headline?: { text: string; style: "display" | "serif-italic" | "sans" }[];
    subtitle?: string;
    image?: string;
    imageAlt?: string;
    accentColor?: string;
    badge?: string;
    bgPrimary?: string;
    bgSecondary?: string;
    bgAccent?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  await requireAdmin();

  try {
    await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(input.label !== undefined && { label: input.label.trim() }),
        ...(input.headline !== undefined && { headline: input.headline }),
        ...(input.subtitle !== undefined && { subtitle: input.subtitle.trim() }),
        ...(input.image !== undefined && { image: input.image.trim() }),
        ...(input.imageAlt !== undefined && { imageAlt: input.imageAlt.trim() }),
        ...(input.accentColor !== undefined && { accentColor: input.accentColor }),
        ...(input.badge !== undefined && { badge: input.badge || null }),
        ...(input.bgPrimary !== undefined && { bgPrimary: input.bgPrimary }),
        ...(input.bgSecondary !== undefined && { bgSecondary: input.bgSecondary }),
        ...(input.bgAccent !== undefined && { bgAccent: input.bgAccent }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error updating hero slide:", error);
    return { success: false as const, error: "Failed to update hero slide." };
  }
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();

  try {
    await prisma.heroSlide.delete({ where: { id } });
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error deleting hero slide:", error);
    return { success: false as const, error: "Failed to delete hero slide." };
  }
}

export async function reorderHeroSlides(ids: string[]) {
  await requireAdmin();

  try {
    await Promise.all(
      ids.map((id, index) =>
        prisma.heroSlide.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Error reordering hero slides:", error);
    return { success: false as const, error: "Failed to reorder hero slides." };
  }
}
