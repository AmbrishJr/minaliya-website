import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import prisma from './prisma';
import { generateInvoiceHTML, InvoiceData, InvoiceItem } from './invoiceTemplate';
import { sendInvoiceEmail } from './email';

// Make sure to define these environment variables or use fallback values
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'Minaliya Goods And Services, Chennai, Tamil Nadu, India';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+91 98414 22998';
const COMPANY_EMAIL = process.env.ADMIN_EMAIL || 'support@minaliya.in';
const COMPANY_GST = process.env.COMPANY_GST || 'Pending';
const COMPANY_FSSAI = process.env.COMPANY_FSSAI || 'Pending';
const LOGO_URL = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`;

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), 'public', 'invoices');

async function ensureStorageDir() {
  try {
    await fs.mkdir(INVOICE_STORAGE_PATH, { recursive: true });
  } catch (error) {
    console.error('Failed to create invoice storage directory', error);
  }
}

export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  
  // Find the highest invoice number for the current year
  const lastOrder = await prisma.order.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV-${currentYear}-`,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });

  let nextSequence = 1;
  if (lastOrder && lastOrder.invoiceNumber) {
    const parts = lastOrder.invoiceNumber.split('-');
    if (parts.length === 3) {
      nextSequence = parseInt(parts[2], 10) + 1;
    }
  }

  const paddedSequence = nextSequence.toString().padStart(6, '0');
  return `INV-${currentYear}-${paddedSequence}`;
}

export async function generateInvoicePDF(orderId: string, forceRegenerate = false): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        },
        user: true,
      }
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.invoiceGenerated && !forceRegenerate) {
      return { success: true, url: order.invoiceUrl || undefined };
    }

    let invoiceNumber = order.invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = await generateInvoiceNumber();
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceNumber, invoiceDate: new Date() },
      });
    }

    await ensureStorageDir();
    const fileName = `${invoiceNumber}.pdf`;
    const filePath = path.join(INVOICE_STORAGE_PATH, fileName);
    // Relative URL from the public directory
    const invoiceUrl = `/invoices/${fileName}`;

    const shippingAddress = order.shippingAddress as Record<string, string>;
    const items: InvoiceItem[] = order.items.map((item, index) => {
        return {
            sno: index + 1,
            productName: item.product.name,
            productImage: item.product.images[0] || "",
            quantity: item.quantity,
            unit: "NOS",
            pricePerUnit: Number(item.price),
            discount: 0,
            gstPercent: 5,
            totalPrice: Number(item.price) * item.quantity,
        };
    });

    const subtotal = Number(order.totalAmount);
    const shippingCharges = 0; // Assume free for now or extract from logic

    const invoiceData: InvoiceData = {
      companyName: 'Minaliya Goods And Services',
      companyAddress: COMPANY_ADDRESS,
      companyPhone: COMPANY_PHONE,
      companyEmail: COMPANY_EMAIL,
      companyGst: COMPANY_GST,
      companyFssai: COMPANY_FSSAI,
      logoUrl: LOGO_URL,
      invoiceNumber,
      orderId: order.id,
      invoiceDate: (order.invoiceDate || order.createdAt).toLocaleDateString('en-IN'),
      invoiceTime: (order.invoiceDate || order.createdAt).toLocaleTimeString('en-IN'),
      paymentStatus: order.paymentStatus === 'PAID' ? 'Paid' : 'Pending',
      paymentMethod: order.paymentMethod,
      placeOfSupply: shippingAddress.state || 'Tamil Nadu',
      customerName: shippingAddress.name,
      customerEmail: shippingAddress.email || '',
      customerPhone: shippingAddress.phone || '',
      billingAddress: shippingAddress.address,
      shippingAddress: shippingAddress.address,
      customerState: shippingAddress.state,
      customerPincode: shippingAddress.pinCode,
      items,
      subtotal,
      couponDiscount: 0,
      shippingCharges,
      cgst: 0,
      sgst: 0,
      igst: 0,
      roundOff: 0,
      grandTotal: subtotal,
      amountPaid: order.paymentStatus === 'PAID' ? subtotal : 0,
      balance: order.paymentStatus === 'PAID' ? 0 : subtotal,
    };

    const htmlContent = generateInvoiceHTML(invoiceData);

    const isLocal = !process.env.VERCEL_ENV && process.env.NODE_ENV !== 'production';
    
    let executablePath: string | undefined;
    
    if (isLocal) {
        // Common paths for Windows local development
        executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
        executablePath = await chromium.executablePath();
    }

    const browser = await puppeteer.launch({
        args: isLocal ? [] : chromium.args,
        defaultViewport: { width: 1280, height: 720 },
        executablePath,
        headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'load' });
    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await browser.close();

    await prisma.order.update({
        where: { id: orderId },
        data: {
            invoiceGenerated: true,
            invoiceUrl,
        }
    });

    return { success: true, url: invoiceUrl };
  } catch (error) {
    console.error('Invoice PDF generation failed:', error);
    return { success: false, error: 'Failed to generate invoice PDF' };
  }
}

export async function processInvoice(orderId: string): Promise<void> {
  try {
      const order = await prisma.order.findUnique({ where: { id: orderId }});
      if (!order) {
        console.error('Order not found for invoice processing:', orderId);
        return;
      }

      if (order.invoiceSent) {
        console.log(`Invoice already sent for order ${orderId}, skipping`);
        return;
      }

      const pdfResult = await generateInvoicePDF(orderId);
      if (pdfResult.success) {
          const emailResult = await sendInvoiceEmail(order);
          if (emailResult) {
              await prisma.order.update({
                  where: { id: orderId },
                  data: { invoiceSent: true }
              });
              console.log(`Invoice sent successfully for order ${orderId}`);
          } else {
              console.error(`Failed to send invoice email for order ${orderId}`);
          }
      } else {
          console.error(`Failed to generate invoice PDF for order ${orderId}:`, pdfResult.error);
      }
  } catch (error) {
      console.error('Error processing invoice for order:', orderId, error);
  }
}
