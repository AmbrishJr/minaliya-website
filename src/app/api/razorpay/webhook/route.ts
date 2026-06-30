import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { processInvoice } from "@/lib/invoiceService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        const updatedOrders = await prisma.order.findMany({
          where: { razorpayOrderId },
        });

        if (updatedOrders.length === 0) {
          // Order might not have razorpayOrderId set yet if the create-order API
          // didn't save it (e.g., old flow before the fix). Log and bail —
          // the verify-payment route will handle invoice processing.
          console.warn(`Webhook: no order found for razorpayOrderId ${razorpayOrderId}, deferring to verify-payment`);
          return NextResponse.json({ status: "ok" });
        }

        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            paymentStatus: "PAID",
            razorpayPaymentId,
          },
        });

        // Process invoice for each matched order
        for (const order of updatedOrders) {
          await processInvoice(order.id);
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: { paymentStatus: "FAILED" },
        });
        break;
      }

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "ok" });
  }
}
