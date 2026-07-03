import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processInvoice } from "@/lib/invoiceService";
import { verifyAdminSession } from "@/actions/admin";

export async function POST() {
  try {
    const { isAdmin } = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find PAID orders where invoice wasn't generated or email wasn't sent
    const failedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        OR: [
          { invoiceGenerated: false },
          { invoiceSent: false },
        ],
      },
      select: { id: true, invoiceGenerated: true, invoiceSent: true },
      orderBy: { createdAt: "desc" },
    });

    if (failedOrders.length === 0) {
      return NextResponse.json({ message: "No failed invoices to retry", processed: 0 });
    }

    // Fire processing for each — don't block the response
    for (const order of failedOrders) {
      processInvoice(order.id).catch(err =>
        console.error("Retry invoice processing failed for order", order.id, err)
      );
    }

    return NextResponse.json({
      message: `Retrying invoice for ${failedOrders.length} orders`,
      processed: failedOrders.length,
      orders: failedOrders.map(o => o.id),
    });
  } catch (error) {
    console.error("Error retrying invoices:", error);
    return NextResponse.json({ error: "Failed to retry invoices" }, { status: 500 });
  }
}

// Also support GET for easy cron job triggers
export async function GET() {
  return POST();
}
