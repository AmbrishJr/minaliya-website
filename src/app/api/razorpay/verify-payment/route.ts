import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { processInvoice } from "@/lib/invoiceService";
import { sendAdminOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      });
    }

    // Schedule background work that survives after the response is sent.
    // `after()` guarantees the runtime keeps the function alive until completion,
    // unlike fire-and-forget promises which get killed on serverless platforms.
    if (orderId) {
      after(async () => {
        try {
          await sendAdminOrderConfirmationEmail(orderId);
        } catch (err) {
          console.error(`Admin order confirmation email failed for order ${orderId}:`, err);
        }
        try {
          await processInvoice(orderId);
        } catch (err) {
          console.error(`Background invoice processing failed for order ${orderId}:`, err);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
