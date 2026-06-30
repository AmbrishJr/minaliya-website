import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import prisma from './prisma';
import { generateInvoiceHTML, InvoiceData, InvoiceItem } from './invoiceTemplate';
import { sendInvoiceEmail } from './email';

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

const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'Old No 87, New No 78, Shop No 3, Kodambakkam Road,<br>Mettupalayam, West Mambalam, Chennai – 600033,<br>Tamil Nadu, India';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+91 98414 22998';
const COMPANY_EMAIL = process.env.ADMIN_EMAIL || 'mailme@minaliya.in';
const COMPANY_GST = process.env.COMPANY_GST || '33APKPD8864Q3Z3';
const COMPANY_FSSAI = process.env.COMPANY_FSSAI || '12423002001621';
const LOGO_URL = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`;

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), 'public', 'invoices');

const GST_RATE = 5; // 5% GST on food items

// Common local Chrome installation paths
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/snap/bin/chromium',
];

async function ensureStorageDir() {
  try {
    await fs.mkdir(INVOICE_STORAGE_PATH, { recursive: true });
  } catch {
    console.error('Failed to create invoice storage directory');
  }
}

async function findChromeExecutable(): Promise<string | undefined> {
  for (const p of CHROME_PATHS) {
    try {
      await fs.access(p);
      return p;
    } catch {
      continue;
    }
  }
  // On Windows, also check the registry-based path
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

export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const lastOrder = await prisma.order.findFirst({
    where: { invoiceNumber: { startsWith: `INV-${currentYear}-` } },
    orderBy: { invoiceNumber: 'desc' },
  });

  let nextSequence = 1;
  if (lastOrder && lastOrder.invoiceNumber) {
    const parts = lastOrder.invoiceNumber.split('-');
    if (parts.length === 3) {
      nextSequence = parseInt(parts[2], 10) + 1;
    }
  }

  return `INV-${currentYear}-${nextSequence.toString().padStart(6, '0')}`;
}

export async function generateInvoicePDF(
  orderId: string,
  forceRegenerate = false
): Promise<{ success: boolean; url?: string; error?: string }> {
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
    const invoiceUrl = `/invoices/${fileName}`;

    const shippingAddress = order.shippingAddress as Record<string, string>;
    const items: InvoiceItem[] = order.items.map((item, index) => {
      const hsn = getHsnCode(item.product.name);
      const lineTotal = Number(item.price) * item.quantity;
      return {
        sno: index + 1,
        productName: item.product.name,
        productImage: item.product.images[0] || "",
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
      shippingCharges: 0,
      cgst,
      sgst,
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
      executablePath = await findChromeExecutable();
      if (!executablePath) {
        console.warn('Chrome not found in common paths. Install Google Chrome or set CHROME_PATH env var.');
      }
    } else {
      executablePath = await chromium.executablePath();
    }

    if (!executablePath) {
      return { success: false, error: 'Chrome/Chromium executable not found. Install Google Chrome or set CHROME_PATH env var.' };
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
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await browser.close();

    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceGenerated: true, invoiceUrl },
    });

    return { success: true, url: invoiceUrl };
  } catch (error) {
    console.error('Invoice PDF generation failed:', error);
    return { success: false, error: 'Failed to generate invoice PDF' };
  }
}

export async function processInvoice(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.error('Order not found for invoice processing:', orderId);
      return;
    }

    // Idempotency: skip if invoice email already sent
    if (order.invoiceEmailStatus === 'SENT') {
      console.log(`Invoice email already sent for order ${orderId}, skipping`);
      return;
    }

    // 1. Generate invoice PDF — must succeed before email is sent
    const pdfResult = await generateInvoicePDF(orderId);
    if (!pdfResult.success) {
      console.error(`PDF generation failed for order ${orderId}, not sending email:`, pdfResult.error);
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceEmailStatus: 'FAILED' },
      });
      return;
    }

    // 2. Verify PDF file exists on disk before sending email
    const pdfUrl = pdfResult.url!;
    const pdfPath = pdfUrl.startsWith('/')
      ? path.join(process.cwd(), 'public', pdfUrl)
      : pdfUrl;
    try {
      await fs.access(pdfPath);
    } catch {
      console.error(`PDF file not found on disk for order ${orderId}, not sending email`);
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceEmailStatus: 'FAILED' },
      });
      return;
    }

    // 3. Re-fetch order — now has invoiceNumber, invoiceGenerated=true, invoiceUrl
    const updatedOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!updatedOrder) {
      console.error('Order disappeared after PDF generation:', orderId);
      return;
    }

    // Verify invoice is marked as generated in DB
    if (!updatedOrder.invoiceGenerated || !updatedOrder.invoiceNumber) {
      console.error(`Invoice metadata missing in DB for order ${orderId}, not sending email`);
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceEmailStatus: 'FAILED' },
      });
      return;
    }

    // 4. Read PDF buffer for email attachment
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await fs.readFile(pdfPath);
    } catch (readErr) {
      console.warn(`Could not read PDF file for order ${orderId}:`, readErr);
    }

    // 5. Mark as PENDING before attempting send
    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceEmailStatus: 'PENDING' },
    });

    // 6. Send email with PDF attachment (includes download link in email body)
    const emailResult = await sendInvoiceEmail(updatedOrder, pdfBuffer);

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
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceEmailStatus: 'FAILED' },
      });
      console.error(`Failed to send invoice email for order ${orderId}`);
      if (!process.env.EMAIL_OTP_API_URL || !process.env.EMAIL_OTP_USERID || !process.env.EMAIL_OTP_PASSWORD) {
        console.error('EMAIL_OTP_* environment variables are not set in production');
      }
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
