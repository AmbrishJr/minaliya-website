import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import prisma from './prisma';
import { generateInvoiceHTML, InvoiceData, InvoiceItem } from './invoiceTemplate';
import { sendInvoiceEmail } from './email';
import { uploadInvoicePdf } from './cloudinary';

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), 'public', 'invoices');

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

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
];

async function findChromeExecutable(): Promise<string | undefined> {
  const fs = await import('fs/promises');
  for (const p of CHROME_PATHS) {
    try {
      await fs.access(p);
      return p;
    } catch {
      continue;
    }
  }
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA;
    if (localAppData) {
      const edgePath = path.join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe');
      try {
        await fs.access(edgePath);
        return edgePath;
      } catch {}
    }
  }
  return undefined;
}

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
    if (order.invoiceGenerated && !forceRegenerate) {
      return { success: true, url: order.invoiceUrl || undefined };
    }

    const invoiceNumber = order.invoiceNumber || `INV-${order.id.slice(-8).toUpperCase()}`;

    if (!order.invoiceNumber) {
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceNumber, invoiceDate: new Date() },
      });
    }

    const shippingAddress = order.shippingAddress as Record<string, string>;
    const items: InvoiceItem[] = order.items.map((item, index) => {
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

    const htmlContent = generateInvoiceHTML(invoiceData);

    const isLocal = !process.env.VERCEL_ENV && process.env.NODE_ENV !== 'production';

    let executablePath: string | undefined;
    if (isLocal) {
      executablePath = await findChromeExecutable();
      if (!executablePath) {
        console.warn('Chrome not found in common paths. Install Google Chrome or set CHROME_PATH env var.');
      }
    } else {
      executablePath = await chromium.executablePath();
    }

    if (!executablePath) {
      return { success: false, error: 'Chrome/Chromium executable not found.' };
    }

    const launchOptions: Record<string, unknown> = {
      args: isLocal ? [] : chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: true,
    };

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'load' });
    const pdfBuffer = Buffer.from(await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    }));
    await browser.close();

    const uploadResult = await uploadInvoicePdf(pdfBuffer, invoiceNumber);

    // Save locally so the /api/orders/[id]/invoice route can serve it
    if (!existsSync(INVOICE_STORAGE_PATH)) {
      mkdirSync(INVOICE_STORAGE_PATH, { recursive: true });
    }
    const localPath = path.join(INVOICE_STORAGE_PATH, `${invoiceNumber}.pdf`);
    await fs.writeFile(localPath, pdfBuffer);

    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceGenerated: true, invoiceUrl: uploadResult.secure_url },
    });

    return { success: true, url: uploadResult.secure_url, buffer: pdfBuffer };
  } catch (error) {
    console.error('Invoice PDF generation failed:', error);
    return { success: false, error: 'Failed to generate invoice PDF' };
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

    const pdfResult = await generateInvoicePDF(orderId);

    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!updatedOrder) {
      console.error('Order disappeared after processing:', orderId);
      return;
    }

    const emailResult = await sendInvoiceEmail(updatedOrder, updatedOrder.items, pdfResult.buffer);

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
