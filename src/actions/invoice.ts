"use server";

import prisma from "@/lib/prisma";
import { generateInvoicePDF } from "@/lib/invoiceService";
import { sendInvoiceEmail } from "@/lib/email";
import { verifyAdminSession } from "./admin";

export async function regenerateInvoice(orderId: string) {
  const { isAdmin } = await verifyAdminSession();
  
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await generateInvoicePDF(orderId, true);
    if (result.success) {
      return { success: true, url: result.url };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error regenerating invoice:", error);
    return { success: false, error: "Failed to regenerate invoice" };
  }
}

export async function resendInvoiceEmailAction(orderId: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: { include: { product: true } },
        },
      });
  
      if (!order) {
        return { success: false, error: "Order not found" };
      }
  
      const emailResult = await sendInvoiceEmail(order, order.items);
      
      if (emailResult?.success) {
        await prisma.order.update({
          where: { id: orderId },
          data: { invoiceSent: true }
        });
        return { success: true };
      } else {
        return { success: false, error: "Failed to send email" };
      }
    } catch (error) {
      console.error("Error resending invoice email:", error);
      return { success: false, error: "Failed to resend invoice email" };
    }
  }
