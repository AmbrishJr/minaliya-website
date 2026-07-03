import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const { amount, currency, orderId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // If the DB order already has a Razorpay order ID, try to reuse it
    if (orderId) {
      const existing = await prisma.order.findUnique({
        where: { id: orderId },
        select: { razorpayOrderId: true, paymentStatus: true },
      });

      if (existing?.razorpayOrderId && existing.paymentStatus === "PENDING") {
        try {
          const existingRzpOrder = await getRazorpay().orders.fetch(existing.razorpayOrderId);
          if (existingRzpOrder.status === "created" || existingRzpOrder.status === "attempted") {
            return NextResponse.json(existingRzpOrder);
          }
        } catch {
          // Razorpay order not found or expired — create a new one
        }
      }
    }

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await getRazorpay().orders.create(options);

    // Save the Razorpay order ID on the DB order immediately so the webhook
    // can find it even if the frontend's verify-payment call is delayed.
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { razorpayOrderId: razorpayOrder.id },
      }).catch(err => console.error("Failed to link razorpayOrderId to order:", err));
    }

    return NextResponse.json(razorpayOrder);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
