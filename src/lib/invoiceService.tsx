import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import prisma from "./prisma";
import { InvoiceDocument, InvoiceData } from "./invoicePDF";
import { sendInvoiceEmail } from "./email";
import { uploadInvoicePdf } from "./cloudinary";

const PRODUCT_HSN: Record<string, string> = {
  'groundnut oil': '15089091',
  'sesame oil': '15155091',
  'coconut oil': '15131100',
};

function getHsnCode(productName: string): string {
  const key = productName.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  for (const [name, hsn] of Object.entries(PRODUCT_HSN)) {
    if (key.includes(name)) return hsn;
  }
  return '';
}

const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'Old No 87, New No 78, Shop No 3, Kodambakkam Road,<br>Mettupalayam, West Mambalam, Chennai \u2013 600033,<br>Tamil Nadu, India';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+91 98414 22998';
const COMPANY_EMAIL = process.env.ADMIN_EMAIL || 'mailme@minaliya.in';
const COMPANY_GST = process.env.COMPANY_GST || '33APKPD8864Q3Z3';
const COMPANY_FSSAI = process.env.COMPANY_FSSAI || '12423002001621';

const GST_RATE = 5;

export async function generateInvoicePDF(
  orderId: string,
  forceRegenerate = false
): Promise<{ success: boolean; url?: string; buffer?: Buffer; error?: string }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (!order) return { success: false, error: 'Order not found' };

    // If already generated and caller doesn't need a fresh copy, fetch from Cloudinary
    if (order.invoiceGenerated && !forceRegenerate) {
      if (order.invoiceUrl) {
        try {
          const response = await fetch(order.invoiceUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            return { success: true, url: order.invoiceUrl, buffer: Buffer.from(arrayBuffer) };
          }
        } catch {
          // Cloudinary fetch failed — fall through to regenerate
        }
      }
      // No valid Cloudinary URL or fetch failed — regenerate
    }

    const invoiceNumber = order.invoiceNumber || `INV-${order.id.slice(-8).toUpperCase()}`;

    if (!order.invoiceNumber) {
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceNumber, invoiceDate: new Date() },
      });
    }

    const shippingAddress = order.shippingAddress as Record<string, string>;
    const items = order.items.map((item, index) => {
      const hsn = getHsnCode(item.product.name);
      const lineTotal = Number(item.price) * item.quantity;
      return {
        sno: index + 1,
        productName: item.product.name,
        hsnSac: hsn || undefined,
        quantity: item.quantity,
        unit: "NOS",
        pricePerUnit: Number(item.price),
        discount: 0,
        gstPercent: GST_RATE,
        totalPrice: lineTotal,
      };
    });

    const subtotal = Number(order.totalAmount);
    const gstTotal = items.reduce((sum, item) => {
      return sum + Math.round((item.totalPrice * GST_RATE) / 100 * 100) / 100;
    }, 0);
    const cgst = gstTotal / 2;
    const sgst = gstTotal / 2;

    const invoiceData: InvoiceData = {
      companyName: 'Minaliya Goods And Services',
      companyAddress: COMPANY_ADDRESS,
      companyPhone: COMPANY_PHONE,
      companyEmail: COMPANY_EMAIL,
      companyGst: COMPANY_GST,
      companyFssai: COMPANY_FSSAI,
      invoiceNumber,
      orderId: order.id.slice(-8).toUpperCase(),
      invoiceDate: (order.invoiceDate || order.createdAt).toLocaleDateString('en-IN'),
      invoiceTime: (order.invoiceDate || order.createdAt).toLocaleTimeString('en-IN'),
      customerName: shippingAddress.name,
      customerEmail: shippingAddress.email || '',
      customerPhone: shippingAddress.phone || '',
      billingAddress: shippingAddress.address,
      customerState: shippingAddress.state,
      customerPincode: shippingAddress.pinCode,
      items,
      subtotal,
      couponDiscount: 0,
      shippingCharges: 0,
      cgst,
      sgst,
      igst: 0,
      logoUrl: process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
        : 'https://www.minaliya.in/logo.png',
      roundOff: 0,
      grandTotal: subtotal,
      amountPaid: order.paymentStatus === 'PAID' ? subtotal : 0,
      balance: order.paymentStatus === 'PAID' ? 0 : subtotal,
    };

    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoiceDocument, { data: invoiceData }) as any
    );

    const uploadResult = await uploadInvoicePdf(pdfBuffer, invoiceNumber);

    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceGenerated: true, invoiceUrl: uploadResult.secure_url },
    });

    return { success: true, url: uploadResult.secure_url, buffer: pdfBuffer };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Invoice PDF generation failed:', message, error);
    return { success: false, error: `Failed to generate invoice PDF: ${message}` };
  }
}

export async function processInvoice(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!order) {
      console.error('Order not found for invoice processing:', orderId);
      return;
    }

    if (order.invoiceSent) {
      console.log(`Invoice already sent for order ${orderId}, skipping`);
      return;
    }

    if (order.invoiceEmailStatus === 'PROCESSING') {
      console.log(`Invoice is currently being processed for order ${orderId}, skipping duplicate call`);
      return;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceEmailStatus: 'PROCESSING' },
    });

    let invoiceNumber = order.invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = `INV-${order.id.slice(-8).toUpperCase()}`;
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceNumber, invoiceDate: new Date() },
      });
    }

    const emailResult = await sendInvoiceEmail(order, order.items);

    if (emailResult.success) {
      const updateData: Record<string, any> = {
        invoiceEmailStatus: 'SENT',
        invoiceEmailSentAt: new Date(),
        invoiceSent: true,
      };
      if (emailResult.messageId) {
        updateData.invoiceEmailMessageId = emailResult.messageId;
      }
      await prisma.order.update({
        where: { id: orderId },
        data: updateData,
      });
      console.log(`Invoice email sent successfully for order ${orderId}`);
    } else {
      console.error(`Failed to send invoice email for order ${orderId}`);
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceEmailStatus: 'FAILED' },
      });
    }
  } catch (error) {
    console.error('Error processing invoice for order:', orderId, error);
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceEmailStatus: 'FAILED' },
      });
    } catch { /* ignore secondary error */ }
  }
}

export async function retryFailedInvoiceEmail(orderId: string): Promise<boolean> {
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.error('Order not found for retry:', orderId);
      return false;
    }
    if (order.invoiceEmailStatus !== 'FAILED') {
      console.log(`Order ${orderId} status is ${order.invoiceEmailStatus}, not retrying`);
      return false;
    }
    await processInvoice(orderId);
    return true;
  } catch (error) {
    console.error('Error retrying invoice email for order:', orderId, error);
    return false;
  }
}
