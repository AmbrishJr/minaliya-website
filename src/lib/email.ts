const EMAIL_API_URL = process.env.EMAIL_OTP_API_URL || "";
const EMAIL_USERID = process.env.EMAIL_OTP_USERID || "";
const EMAIL_PASSWORD = process.env.EMAIL_OTP_PASSWORD || "";
const EMAIL_FROM_NAME = process.env.EMAIL_OTP_FROM_NAME || "Minaliya";

import prisma from "./prisma";
import type { Prisma } from "@prisma/client";

const EMAIL_CONFIG_OK = !!(EMAIL_API_URL && EMAIL_USERID && EMAIL_PASSWORD);

if (!EMAIL_CONFIG_OK) {
  console.warn(
    "[Email] MISSING EMAIL_OTP_* environment variables — emails will not be sent. " +
    "Set EMAIL_OTP_API_URL, EMAIL_OTP_USERID, EMAIL_OTP_PASSWORD in your .env"
  );
}

function formatExpiryTime(): string {
  const now = new Date();
  const expiry = new Date(now.getTime() + 5 * 60 * 1000);
  return expiry.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

async function sendEmail(
  recipientEmail: string,
  subject: string,
  content: string
): Promise<{ success: boolean; messageId?: string }> {
  if (!EMAIL_CONFIG_OK) {
    console.error(`[Email] Cannot send to ${recipientEmail}: EMAIL_OTP_* env vars not configured`);
    return { success: false };
  }

  try {
    const params = new URLSearchParams();
    params.append("method", "EMS_POST_CAMPAIGN");
    params.append("userid", EMAIL_USERID);
    params.append("password", EMAIL_PASSWORD);
    params.append("v", "1.1");
    params.append("name", EMAIL_FROM_NAME);
    params.append("recipients", recipientEmail);
    params.append("subject", subject);
    params.append("content", content);
    params.append("content_type", "text/html");

    const response = await fetch(EMAIL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const text = await response.text();
    const success = response.ok && text.toLowerCase().startsWith("success");
    console.log(`[Email] ${success ? "Sent" : "Failed"} to ${recipientEmail}, response: ${text}`);

    return { success, messageId: success ? text.trim() : undefined };
  } catch (error) {
    console.error(`[Email] Failed to send to ${recipientEmail}:`, error);
    return { success: false };
  }
}

export async function sendOtpEmail(
  recipientEmail: string,
  otp: string,
  customerName?: string
): Promise<boolean> {
  const name = customerName?.trim() || "Customer";
  const expiryTime = formatExpiryTime();

  const subject = "Your Minaliya Login OTP";
  const content = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f3ef;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2d3e2f;border-radius:8px;padding:10px 28px;">
                    <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">MINALIYA</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 36px 32px;text-align:left;">
              <p style="margin:0 0 6px 0;font-size:14px;color:#6b7280;">Dear Customer,</p>
              <p style="margin:0 0 20px 0;font-size:18px;font-weight:600;color:#2d3e2f;">${name},</p>
              <p style="margin:0 0 16px 0;font-size:14px;color:#4b5563;line-height:1.6;">
                This email is in reference to your request on <strong>Minaliya</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:24px;margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 10px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">One-Time Password</p>
                    <p style="margin:0;font-size:38px;font-weight:700;letter-spacing:8px;color:#2d3e2f;">${otp}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px 0;font-size:13px;color:#6b7280;line-height:1.6;">The same has also been sent to your registered WhatsApp number.</p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4b5563;line-height:1.6;">
                This OTP is valid for <strong style="color:#2d3e2f;">5 minutes</strong> until <strong style="color:#2d3e2f;">${expiryTime}</strong>. Upon expiry, kindly regenerate the OTP.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef8e7;border-left:4px solid #eab308;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      <strong>&#9888; Security Alert:</strong> Please do not share this OTP with anyone. Minaliya Goods And Services will never ask for your OTP via phone call, WhatsApp, email, or any other communication channel.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 4px 0;font-size:13px;color:#6b7280;line-height:1.6;">
                <strong>Note:</strong> If you have not initiated this request, please contact us immediately at
                <a href="tel:+919841422998" style="color:#2d3e2f;font-weight:600;text-decoration:none;">+91 98414 22998</a>
                or write to us at
                <a href="mailto:mailme@minaliya.in" style="color:#2d3e2f;font-weight:600;text-decoration:none;">mailme@minaliya.in</a>.
              </p>
              <p style="margin:20px 0 0 0;font-size:12px;color:#9ca3af;font-style:italic;">This is a system-generated email. Please do not reply to this message.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:0 36px 32px;margin-top:-1px;">
              <div style="border-top:1px solid #e5e4e0;padding-top:20px;">
                <p style="margin:0 0 4px 0;font-size:14px;color:#2d3e2f;font-weight:600;">Regards,</p>
                <p style="margin:0 0 2px 0;font-size:14px;color:#4b5563;font-weight:600;">Team Minaliya</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Minaliya Goods And Services</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Chennai, Tamil Nadu, India</p>
                <table cellpadding="0" cellspacing="0" style="margin-top:8px;">
                  <tr>
                    <td style="padding-right:6px;font-size:12px;color:#6b7280;">&#9993;</td>
                    <td><a href="mailto:mailme@minaliya.in" style="font-size:12px;color:#2d3e2f;text-decoration:none;">mailme@minaliya.in</a></td>
                    <td style="padding:0 6px;font-size:12px;color:#9ca3af;">|</td>
                    <td style="padding-right:6px;font-size:12px;color:#6b7280;">&#9742;</td>
                    <td><a href="tel:+919841422998" style="font-size:12px;color:#2d3e2f;text-decoration:none;">+91 98414 22998</a></td>
                    <td style="padding:0 6px;font-size:12px;color:#9ca3af;">|</td>
                    <td style="padding-right:6px;font-size:12px;color:#6b7280;">&#127760;</td>
                    <td><a href="https://www.minaliya.com" style="font-size:12px;color:#2d3e2f;text-decoration:none;">www.minaliya.com</a></td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top:20px;">
              <div style="border-top:1px solid #d6d5d0;padding-top:16px;">
                <p style="margin:0 0 10px 0;font-size:11px;color:#9ca3af;line-height:1.5;">
                  <strong style="color:#6b7280;">Disclaimer:</strong><br>
                  This email is generated automatically for informational purposes only and should not be considered as an acknowledgment, authentication, or approval of any transaction beyond the verification request initiated by you.
                </p>
                <p style="margin:0 0 10px 0;font-size:11px;color:#9ca3af;line-height:1.5;">
                  The information contained in this email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify the sender immediately and delete it from your system.
                </p>
                <p style="margin:0 0 10px 0;font-size:11px;color:#9ca3af;line-height:1.5;">
                  While Minaliya Goods And Services takes reasonable measures to ensure the security and accuracy of electronic communications, we do not guarantee that this email will be free from errors, interruptions, viruses, or other harmful components. Recipients are advised to perform appropriate security checks before opening any attachments or links.
                </p>
                <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
                  Minaliya Goods And Services shall not be liable for any direct or indirect loss arising from the use of, or reliance upon, the information contained in this email.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="margin:0;font-size:11px;color:#b0afa8;">&copy; 2026 Minaliya Goods And Services. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const result = await sendEmail(recipientEmail, subject, content);
  return result.success;
}

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

type OrderLike = {
  id: string;
  shippingAddress?: Prisma.JsonValue;
  invoiceNumber?: string | null;
  invoiceDate?: Date | string | null;
  createdAt: Date | string;
  paymentStatus?: string | null;
  totalAmount: { toString: () => string } | number;
  awbNumber?: string | null;
};

type InvoiceItemLike = {
  product?: { name?: string } | null;
  productName?: string;
  quantity?: number;
  price?: number | { toString: () => string };
};

export async function sendInvoiceEmail(
  order: OrderLike,
  orderItems?: InvoiceItemLike[],
  invoiceUrl?: string,
): Promise<{ success: boolean; messageId?: string }> {
  try {
    const shippingAddress = order.shippingAddress as Record<string, string>;
    const recipientEmail = shippingAddress?.email;
    const customerName = shippingAddress?.name || "Customer";

    if (!recipientEmail) {
      console.log(`[Email Invoice] No email address provided for order ${order.id}`);
      return { success: false };
    }

    const orderIdShort = order.id.slice(-8).toUpperCase();
    const invoiceNumber = order.invoiceNumber || "Pending";

    const subject = `Tax Invoice - ${invoiceNumber} - Minaliya Goods And Services`;

    const items = (orderItems || []).map((item, index) => {
      const rawName = item.product?.name || item.productName || 'Product';
      const base = rawName.replace(/^Cold Pressed /i, '');
      const productName = `Minaliya Wooden Cold Pressed ${base}`;
      const quantity = item.quantity || 0;
      const pricePerUnit = Number(item.price || 0);
      return {
        sno: index + 1,
        productName,
        quantity,
        unit: 'NOS',
        pricePerUnit,
        hsnSac: getHsnCode(rawName),
        discount: 0,
        gstPercent: 5,
        totalPrice: pricePerUnit * quantity,
      };
    });

    const subtotal = Number(order.totalAmount);
    const gstRate = 5;
    const gstTotal = items.reduce((sum, item) => {
      return sum + Math.round((item.totalPrice * gstRate) / 100 * 100) / 100;
    }, 0);
    const cgst = gstTotal / 2;
    const sgst = gstTotal / 2;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.minaliya.in";
    const logoUrl = `${baseUrl}/logo.png`;

    const orderDate = (order.invoiceDate || order.createdAt)
      ? new Date(order.invoiceDate || order.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : new Date().toLocaleDateString('en-IN');

    const invoiceTime = (order.invoiceDate || order.createdAt)
      ? new Date(order.invoiceDate || order.createdAt).toLocaleTimeString('en-IN')
      : new Date().toLocaleTimeString('en-IN');

    const { generateInvoiceEmailHTML } = await import('./invoiceEmailTemplate');

    const content = generateInvoiceEmailHTML({
      companyName: 'Minaliya Goods And Services',
      companyAddress: process.env.COMPANY_ADDRESS || 'Old No 87, New No 78, Shop No 3, Kodambakkam Road,<br>Mettupalayam, West Mambalam, Chennai – 600033,<br>Tamil Nadu, India',
      companyPhone: process.env.COMPANY_PHONE || '+91 98414 22998',
      companyEmail: process.env.ADMIN_EMAIL || 'mailme@minaliya.in',
      companyGst: process.env.COMPANY_GST || '33APKPD8864Q3Z3',
      companyFssai: process.env.COMPANY_FSSAI || '12423002001621',
      logoUrl,
      invoiceNumber,
      orderId: orderIdShort,
      invoiceDate: orderDate,
      invoiceTime,
      customerName,
      customerEmail: shippingAddress?.email || '',
      customerPhone: shippingAddress?.phone || '',
      billingAddress: shippingAddress?.address || '',
      customerState: shippingAddress?.state || '',
      customerPincode: shippingAddress?.pinCode || '',
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
      invoiceUrl,
    });

    const result = await sendEmail(recipientEmail, subject, content);
    return result;
  } catch (error) {
    console.error("[Email Invoice] Failed to send email:", error);
    return { success: false };
  }
}


export async function sendShipmentEmail(order: OrderLike): Promise<boolean> {
  try {
    const shippingAddress = order.shippingAddress as Record<string, string>;
    const recipientEmail = shippingAddress?.email;
    const customerName = shippingAddress?.name || "Customer";

    if (!recipientEmail) {
      console.log(`[Email Shipment] No email address for order ${order.id}`);
      return false;
    }

    const orderId = order.id.slice(-8).toUpperCase();
    const awbNumber = order.awbNumber || "—";
    const trackingUrl = `https://stcourier.com/track/shipment`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.minaliya.in";
    const orderUrl = `${baseUrl}/account?tab=orders`;

    const subject = `Your Minaliya Order #${orderId} Has Been Shipped!`;

    const content = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f3ef;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2d3e2f;border-radius:8px;padding:10px 28px;">
                    <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">MINALIYA</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 36px 32px;text-align:left;">
              <p style="margin:0 0 6px 0;font-size:14px;color:#6b7280;">Hey ${customerName},</p>
              <p style="margin:0 0 20px 0;font-size:18px;font-weight:600;color:#2d3e2f;">Your order is on its way! 🚚</p>
              <p style="margin:0 0 16px 0;font-size:14px;color:#4b5563;line-height:1.6;">
                Great news! Your order <strong>#${orderId}</strong> has been shipped and is now on its way to you.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:24px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Order Number: <strong style="color:#2d3e2f;">${orderId}</strong></p>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Courier Partner: <strong style="color:#2d3e2f;">ST Courier</strong></p>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Tracking ID: <strong style="color:#2d3e2f;font-family:monospace;">${awbNumber}</strong></p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" style="display:inline-block;background-color:#2d3e2f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;letter-spacing:0.5px;">Track Your Order</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 4px 0;font-size:13px;color:#6b7280;line-height:1.6;">
                You can also view your order details and tracking information in your
                <a href="${orderUrl}" style="color:#2d3e2f;font-weight:600;">account dashboard</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:0 36px 32px;margin-top:-1px;">
              <div style="border-top:1px solid #e5e4e0;padding-top:20px;">
                <p style="margin:0 0 4px 0;font-size:14px;color:#2d3e2f;font-weight:600;">Regards,</p>
                <p style="margin:0 0 2px 0;font-size:14px;color:#4b5563;font-weight:600;">Team Minaliya</p>
                <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Minaliya Goods And Services</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const result = await sendEmail(recipientEmail, subject, content);
    return result.success;
  } catch (error) {
    console.error("[Email Shipment] Failed to send email:", error);
    return false;
  }
}

function formatINR(amount: number): string {
  return (
    "\u20B9" +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Sends a new-order confirmation / fulfillment email to the admin (mailme@minaliya.in)
 * immediately after a payment is successfully verified.
 *
 * Uses the order's adminNotified flag as an atomic claim to avoid duplicate
 * emails when both the verify-payment route and the Razorpay webhook fire.
 */
export async function sendAdminOrderConfirmationEmail(
  orderId: string
): Promise<{ success: boolean; skipped?: boolean }> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      console.error(`[Admin Order Email] Order not found: ${orderId}`);
      return { success: false };
    }

    // Atomic claim — prevents duplicate sends from concurrent webhook + verify-payment
    const claim = await prisma.order.updateMany({
      where: { id: orderId, adminNotified: false },
      data: { adminNotified: true },
    });
    if (claim.count === 0) {
      console.log(`[Admin Order Email] Already notified for order ${orderId}, skipping`);
      return { success: true, skipped: true };
    }

    const adminEmail = [
      process.env.ADMIN_EMAIL || "mailme@minaliya.in",
      "codeimmani@gmail.com",
    ].join(",");
    const shippingAddress = (order.shippingAddress as Record<string, string>) || {};
    const customerName = shippingAddress?.name || "Customer";

    const orderIdShort = order.id.slice(-8).toUpperCase();
    const orderDate = order.createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
    const orderTime = order.createdAt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    const items = order.items.map((item, index) => {
      const size = item.product.slug.includes("500ml") ? "500ml" : "1 Ltr";
      return {
        sno: index + 1,
        productName: item.product.name,
        size,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        lineTotal: Number(item.price) * item.quantity,
      };
    });

    const raw = (order.priceDetails as Record<string, number>) || {};
    const inclSubtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
    const derivedGst = inclSubtotal - inclSubtotal / 1.05;
    const price = {
      subtotal: typeof raw.subtotal === "number" ? raw.subtotal : Math.round((inclSubtotal / 1.05) * 100) / 100,
      gst: typeof raw.gst === "number" ? raw.gst : Math.round(derivedGst * 100) / 100,
      cgst: typeof raw.cgst === "number" ? raw.cgst : Math.round((derivedGst / 2) * 100) / 100,
      sgst: typeof raw.sgst === "number" ? raw.sgst : Math.round((derivedGst / 2) * 100) / 100,
      discount: typeof raw.discount === "number" ? raw.discount : 0,
      shipping: typeof raw.shipping === "number" ? raw.shipping : 0,
      roundOff: typeof raw.roundOff === "number" ? raw.roundOff : 0,
      total: typeof raw.total === "number" ? raw.total : Math.round(Number(order.totalAmount)),
    };

    const paymentMethodLabel =
      (order.paymentMethod || "RAZORPAY").charAt(0) +
      (order.paymentMethod || "RAZORPAY").slice(1).toLowerCase();

    const itemsRows = items
      .map(
        (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;font-size:13px;color:#4b5563;text-align:center;">${item.sno}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;font-size:13px;color:#2d3e2f;font-weight:600;">${item.productName}<br/><span style="font-size:11px;color:#6b7280;font-weight:400;">Size: ${item.size}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;font-size:13px;color:#4b5563;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;font-size:13px;color:#4b5563;text-align:right;">${formatINR(item.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e4e0;font-size:13px;color:#2d3e2f;font-weight:600;text-align:right;">${formatINR(item.lineTotal)}</td>
      </tr>`
      )
      .join("");

    const shippingLines = [
      shippingAddress?.address,
      [shippingAddress?.city, shippingAddress?.state].filter(Boolean).join(", "),
      shippingAddress?.pinCode ? `PIN / ZIP: ${shippingAddress.pinCode}` : "",
      "India",
    ]
      .filter(Boolean)
      .join("<br/>");

    const content = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f3ef;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2d3e2f;border-radius:8px;padding:10px 28px;">
                    <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">MINALIYA</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:36px 32px;text-align:left;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef8e7;border-left:4px solid #eab308;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;color:#92400e;font-weight:700;">New Order Received - Action Required</p>
                    <p style="margin:4px 0 0 0;font-size:13px;color:#92400e;line-height:1.6;">A new order has been placed and paid for. Please review the details below and begin fulfillment.</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;">Order ID</td>
                  <td style="padding:8px 0;font-size:13px;color:#2d3e2f;font-weight:700;text-align:right;">#${orderIdShort}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;">Order Date</td>
                  <td style="padding:8px 0;font-size:13px;color:#2d3e2f;font-weight:600;text-align:right;">${orderDate}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;">Order Time</td>
                  <td style="padding:8px 0;font-size:13px;color:#2d3e2f;font-weight:600;text-align:right;">${orderTime} IST</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;">Payment Method</td>
                  <td style="padding:8px 0;font-size:13px;color:#2d3e2f;font-weight:600;text-align:right;">${paymentMethodLabel}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;">Payment Status</td>
                  <td style="padding:8px 0;font-size:13px;color:#15803d;font-weight:700;text-align:right;">${order.paymentStatus || "PENDING"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#6b7280;">Razorpay Payment ID</td>
                  <td style="padding:8px 0;font-size:13px;color:#2d3e2f;text-align:right;font-family:monospace;">${order.razorpayPaymentId || "\u2014"}</td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right:12px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Customer Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:16px 18px;">
                      <tr><td style="padding:3px 0;font-size:13px;color:#2d3e2f;font-weight:700;">${customerName}</td></tr>
                      <tr><td style="padding:3px 0;font-size:13px;color:#4b5563;">${shippingAddress?.email || "\u2014"}</td></tr>
                      <tr><td style="padding:3px 0;font-size:13px;color:#4b5563;">${shippingAddress?.phone || "\u2014"}</td></tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" style="padding-left:12px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Shipping Address</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:16px 18px;">
                      <tr><td style="padding:3px 0;font-size:13px;color:#2d3e2f;font-weight:700;line-height:1.5;">${shippingLines}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Ordered Products</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e4e0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr style="background:#f0efe9;">
                  <td style="padding:10px 12px;font-size:11px;color:#6b7280;font-weight:600;text-align:center;text-transform:uppercase;">#</td>
                  <td style="padding:10px 12px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;">Product</td>
                  <td style="padding:10px 12px;font-size:11px;color:#6b7280;font-weight:600;text-align:center;text-transform:uppercase;">Qty</td>
                  <td style="padding:10px 12px;font-size:11px;color:#6b7280;font-weight:600;text-align:right;text-transform:uppercase;">Unit Price</td>
                  <td style="padding:10px 12px;font-size:11px;color:#6b7280;font-weight:600;text-align:right;text-transform:uppercase;">Amount</td>
                </tr>
                ${itemsRows}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#6b7280;">Subtotal</td>
                  <td style="padding:6px 0;font-size:13px;color:#2d3e2f;text-align:right;font-weight:600;">${formatINR(price.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#6b7280;">Discount</td>
                  <td style="padding:6px 0;font-size:13px;color:#2d3e2f;text-align:right;font-weight:600;">-${formatINR(price.discount)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#6b7280;">CGST @ 2.5%</td>
                  <td style="padding:6px 0;font-size:13px;color:#2d3e2f;text-align:right;font-weight:600;">${formatINR(price.cgst)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#6b7280;">SGST @ 2.5%</td>
                  <td style="padding:6px 0;font-size:13px;color:#2d3e2f;text-align:right;font-weight:600;">${formatINR(price.sgst)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#6b7280;">Shipping Charges</td>
                  <td style="padding:6px 0;font-size:13px;color:#2d3e2f;text-align:right;font-weight:600;">${price.shipping === 0 ? "FREE" : formatINR(price.shipping)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#6b7280;">Round Off</td>
                  <td style="padding:6px 0;font-size:13px;color:#2d3e2f;text-align:right;font-weight:600;">${formatINR(price.roundOff)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:2px solid #2d3e2f;font-size:14px;color:#2d3e2f;font-weight:700;">Total Amount Paid</td>
                  <td style="padding:10px 0;border-top:2px solid #2d3e2f;font-size:16px;color:#2d3e2f;font-weight:700;text-align:right;">${formatINR(price.total)}</td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:16px 18px;margin-bottom:8px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Customer Notes / Delivery Instructions</p>
                    <p style="margin:0;font-size:13px;color:#2d3e2f;line-height:1.6;">${shippingAddress?.notes || "\u2014"}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:20px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;text-align:center;">
                This is an automated fulfillment notification sent by Minaliya Goods And Services.
                Please do not reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const subject = `New Order #${orderIdShort} - ${customerName} - ${formatINR(price.total)}`;

    const result = await sendEmail(adminEmail, subject, content);

    if (!result.success) {
      // Roll back the claim so a later retry can attempt the send again
      await prisma.order.update({
        where: { id: orderId },
        data: { adminNotified: false },
      });
    }

    return result;
  } catch (error) {
    console.error("[Admin Order Email] Failed to send email:", error);
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { adminNotified: false },
      });
    } catch {
      /* ignore secondary error */
    }
    return { success: false };
  }
}
