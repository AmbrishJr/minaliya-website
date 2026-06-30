import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";
import { verifyAdminSession } from "@/actions/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.invoiceGenerated) {
      return NextResponse.json({ error: "Invoice not generated yet" }, { status: 400 });
    }

    const emailResult = await sendInvoiceEmail(order);
    
    if (emailResult) {
      await prisma.order.update({
        where: { id },
        data: { invoiceSent: true }
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error resending invoice email:", error);
    return NextResponse.json({ error: "Failed to resend invoice email" }, { status: 500 });
  }
}
