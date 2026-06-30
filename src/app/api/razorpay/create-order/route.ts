import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, orderId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
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
