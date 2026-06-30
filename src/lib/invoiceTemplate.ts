/**
 * Professional HTML invoice template for Minaliya Goods And Services.
 * Designed for A4 print, Puppeteer PDF conversion.
 */

import { numberToWords } from "./numberToWords";

export interface InvoiceItem {
  sno: number;
  productName: string;
  productImage: string;
  sku?: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
  gstPercent: number;
  totalPrice: number;
}

export interface InvoiceData {
  // Header
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGst: string;
  companyFssai: string;
  logoUrl?: string;

  // Invoice Details
  invoiceNumber: string;
  orderId: string;
  invoiceDate: string;
  invoiceTime: string;
  paymentStatus: string;
  paymentMethod: string;
  placeOfSupply: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  shippingAddress: string;
  customerState: string;
  customerPincode: string;
  customerGst?: string;

  // Items
  items: InvoiceItem[];

  // Summary
  subtotal: number;
  couponDiscount: number;
  shippingCharges: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
  amountPaid: number;
  balance: number;
}

function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:12px;color:#57534e;">${item.sno}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;">
        <div style="display:flex;align-items:center;gap:10px;">
          ${item.productImage ? `<img src="${item.productImage}" alt="" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #e8e5e0;" />` : ""}
          <div>
            <div style="font-size:12px;font-weight:600;color:#1c1917;">${item.productName}</div>
            ${item.sku ? `<div style="font-size:10px;color:#a8a29e;margin-top:2px;">SKU: ${item.sku}</div>` : ""}
          </div>
        </div>
      </td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:12px;color:#57534e;">${item.hsnSac || "—"}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:12px;color:#57534e;">${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:12px;color:#57534e;">${item.unit}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:right;font-size:12px;color:#57534e;">${formatCurrency(item.pricePerUnit)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:right;font-size:12px;color:#57534e;">${formatCurrency(item.discount)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:12px;color:#57534e;">${item.gstPercent}%</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e8e5e0;text-align:right;font-size:12px;font-weight:700;color:#1c1917;">${formatCurrency(item.totalPrice)}</td>
    </tr>`
    )
    .join("");

  const isIntraState = data.igst === 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1c1917;
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    @page {
      size: A4;
      margin: 12mm 14mm;
    }

    @media print {
      body { background: #ffffff; }
      .invoice-container { box-shadow: none; margin: 0; border-radius: 0; }
    }

    .invoice-container {
      max-width: 794px;
      margin: 0 auto;
      background: #ffffff;
      padding: 0;
    }
  </style>
</head>
<body>
  <div class="invoice-container">

    <!-- ═══════════ HEADER ═══════════ -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:3px solid #2d3e2f;">
      <tr>
        <td style="padding:24px 0 20px 0;" valign="top">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td valign="middle" style="padding-right:16px;">
                ${data.logoUrl
                  ? `<img src="${data.logoUrl}" alt="Minaliya" style="width:56px;height:56px;border-radius:10px;" />`
                  : `<div style="width:56px;height:56px;background:#2d3e2f;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                      <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:1px;">M</span>
                    </div>`
                }
              </td>
              <td valign="middle">
                <div style="font-size:20px;font-weight:800;color:#2d3e2f;letter-spacing:0.5px;">${data.companyName}</div>
                <div style="font-size:11px;color:#78716c;margin-top:4px;line-height:1.5;">
                  ${data.companyAddress}<br />
                  Phone: ${data.companyPhone} &nbsp;|&nbsp; Email: ${data.companyEmail}
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:24px 0 20px 0;text-align:right;" valign="top">
          <div style="font-size:11px;color:#78716c;line-height:1.8;">
            <strong style="color:#57534e;">GSTIN:</strong> ${data.companyGst}<br />
            <strong style="color:#57534e;">FSSAI:</strong> ${data.companyFssai}
          </div>
        </td>
      </tr>
    </table>

    <!-- ═══════════ TAX INVOICE TITLE ═══════════ -->
    <div style="text-align:center;padding:16px 0 12px;">
      <span style="display:inline-block;font-size:16px;font-weight:800;color:#2d3e2f;letter-spacing:3px;text-transform:uppercase;border-bottom:2px solid #c7956d;padding-bottom:4px;">
        Tax Invoice
      </span>
    </div>

    <!-- ═══════════ INVOICE DETAILS ═══════════ -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #e8e5e0;border-radius:10px;margin-bottom:16px;">
      <tr>
        <td style="padding:14px 18px;" width="50%">
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;width:110px;">Invoice Number</td>
              <td style="font-size:12px;font-weight:700;color:#2d3e2f;padding:3px 0;">${data.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;">Order ID</td>
              <td style="font-size:12px;font-weight:600;color:#1c1917;padding:3px 0;">${data.orderId}</td>
            </tr>
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;">Invoice Date</td>
              <td style="font-size:12px;color:#1c1917;padding:3px 0;">${data.invoiceDate}</td>
            </tr>
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;">Invoice Time</td>
              <td style="font-size:12px;color:#1c1917;padding:3px 0;">${data.invoiceTime}</td>
            </tr>
          </table>
        </td>
        <td style="padding:14px 18px;" width="50%">
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;width:110px;">Payment Status</td>
              <td style="padding:3px 0;">
                <span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:3px 10px;border-radius:20px;${data.paymentStatus === "Paid" ? "background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;" : "background:#fffbeb;color:#b45309;border:1px solid #fde68a;"}">${data.paymentStatus}</span>
              </td>
            </tr>
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;">Payment Method</td>
              <td style="font-size:12px;color:#1c1917;padding:3px 0;">${data.paymentMethod}</td>
            </tr>
            <tr>
              <td style="font-size:11px;color:#78716c;padding:3px 0;">Place of Supply</td>
              <td style="font-size:12px;color:#1c1917;padding:3px 0;">${data.placeOfSupply}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- ═══════════ CUSTOMER DETAILS ═══════════ -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td width="50%" style="padding-right:8px;" valign="top">
          <div style="background:#faf9f7;border:1px solid #e8e5e0;border-radius:10px;padding:14px 18px;height:100%;">
            <div style="font-size:10px;font-weight:700;color:#2d3e2f;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;border-bottom:1px solid #e8e5e0;padding-bottom:6px;">Bill To</div>
            <div style="font-size:12px;font-weight:600;color:#1c1917;">${data.customerName}</div>
            <div style="font-size:11px;color:#78716c;margin-top:4px;line-height:1.6;">
              ${data.billingAddress}<br />
              ${data.customerState} — ${data.customerPincode}<br />
              Phone: ${data.customerPhone}<br />
              Email: ${data.customerEmail}
              ${data.customerGst ? `<br />GSTIN: ${data.customerGst}` : ""}
            </div>
          </div>
        </td>
        <td width="50%" style="padding-left:8px;" valign="top">
          <div style="background:#faf9f7;border:1px solid #e8e5e0;border-radius:10px;padding:14px 18px;height:100%;">
            <div style="font-size:10px;font-weight:700;color:#2d3e2f;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;border-bottom:1px solid #e8e5e0;padding-bottom:6px;">Ship To</div>
            <div style="font-size:12px;font-weight:600;color:#1c1917;">${data.customerName}</div>
            <div style="font-size:11px;color:#78716c;margin-top:4px;line-height:1.6;">
              ${data.shippingAddress}<br />
              ${data.customerState} — ${data.customerPincode}<br />
              Phone: ${data.customerPhone}
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ═══════════ PRODUCT TABLE ═══════════ -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e5e0;border-radius:10px;overflow:hidden;margin-bottom:16px;">
      <thead>
        <tr style="background:#2d3e2f;">
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:center;width:40px;">S.No</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">Product</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:center;">HSN/SAC</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:center;width:40px;">Qty</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:center;width:40px;">Unit</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Rate</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Disc.</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:center;width:50px;">GST %</th>
          <th style="padding:10px 8px;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <!-- ═══════════ ORDER SUMMARY ═══════════ -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <!-- Amount in Words (Left) -->
        <td width="50%" valign="top" style="padding-right:16px;">
          <div style="background:#faf9f7;border:1px solid #e8e5e0;border-radius:10px;padding:14px 18px;">
            <div style="font-size:10px;font-weight:700;color:#2d3e2f;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Amount in Words</div>
            <div style="font-size:12px;color:#1c1917;font-weight:500;font-style:italic;line-height:1.5;">${numberToWords(data.grandTotal)}</div>
          </div>
        </td>
        <!-- Summary (Right) -->
        <td width="50%" valign="top">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #e8e5e0;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:8px 18px;font-size:12px;color:#57534e;">Subtotal</td>
              <td style="padding:8px 18px;font-size:12px;color:#1c1917;text-align:right;font-weight:500;">${formatCurrency(data.subtotal)}</td>
            </tr>
            ${data.couponDiscount > 0 ? `
            <tr>
              <td style="padding:4px 18px;font-size:12px;color:#047857;">Coupon Discount</td>
              <td style="padding:4px 18px;font-size:12px;color:#047857;text-align:right;font-weight:500;">-${formatCurrency(data.couponDiscount)}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:4px 18px;font-size:12px;color:#57534e;">Shipping Charges</td>
              <td style="padding:4px 18px;font-size:12px;color:#1c1917;text-align:right;font-weight:500;">${data.shippingCharges === 0 ? "FREE" : formatCurrency(data.shippingCharges)}</td>
            </tr>
            ${isIntraState ? `
            <tr>
              <td style="padding:4px 18px;font-size:12px;color:#57534e;">CGST</td>
              <td style="padding:4px 18px;font-size:12px;color:#1c1917;text-align:right;font-weight:500;">${formatCurrency(data.cgst)}</td>
            </tr>
            <tr>
              <td style="padding:4px 18px;font-size:12px;color:#57534e;">SGST</td>
              <td style="padding:4px 18px;font-size:12px;color:#1c1917;text-align:right;font-weight:500;">${formatCurrency(data.sgst)}</td>
            </tr>` : `
            <tr>
              <td style="padding:4px 18px;font-size:12px;color:#57534e;">IGST</td>
              <td style="padding:4px 18px;font-size:12px;color:#1c1917;text-align:right;font-weight:500;">${formatCurrency(data.igst)}</td>
            </tr>`}
            ${data.roundOff !== 0 ? `
            <tr>
              <td style="padding:4px 18px;font-size:11px;color:#a8a29e;">Round Off</td>
              <td style="padding:4px 18px;font-size:11px;color:#a8a29e;text-align:right;">${data.roundOff > 0 ? "+" : ""}${formatCurrency(data.roundOff)}</td>
            </tr>` : ""}
            <tr>
              <td colspan="2" style="padding:0 18px;"><div style="border-top:2px solid #2d3e2f;"></div></td>
            </tr>
            <tr>
              <td style="padding:10px 18px;font-size:14px;font-weight:800;color:#2d3e2f;">Grand Total</td>
              <td style="padding:10px 18px;font-size:14px;font-weight:800;color:#2d3e2f;text-align:right;">${formatCurrency(data.grandTotal)}</td>
            </tr>
            <tr>
              <td style="padding:4px 18px 10px;font-size:12px;color:#57534e;">Amount Paid</td>
              <td style="padding:4px 18px 10px;font-size:12px;color:#047857;text-align:right;font-weight:600;">${formatCurrency(data.amountPaid)}</td>
            </tr>
            ${data.balance > 0 ? `
            <tr>
              <td style="padding:4px 18px 10px;font-size:12px;color:#b45309;">Balance Due</td>
              <td style="padding:4px 18px 10px;font-size:12px;color:#b45309;text-align:right;font-weight:600;">${formatCurrency(data.balance)}</td>
            </tr>` : ""}
          </table>
        </td>
      </tr>
    </table>

    <!-- ═══════════ FOOTER ═══════════ -->
    <div style="border-top:2px solid #2d3e2f;padding-top:16px;text-align:center;">
      <div style="font-size:13px;font-weight:600;color:#2d3e2f;margin-bottom:6px;">Thank you for shopping with Minaliya!</div>
      <div style="font-size:11px;color:#78716c;margin-bottom:4px;">
        <a href="mailto:support@minaliya.in" style="color:#2d3e2f;text-decoration:none;">support@minaliya.in</a>
        &nbsp;&bull;&nbsp;
        <a href="https://www.minaliya.in" style="color:#2d3e2f;text-decoration:none;">www.minaliya.in</a>
      </div>
      <div style="font-size:10px;color:#a8a29e;margin-top:8px;font-style:italic;">
        This is a computer-generated invoice. Signature is not required.
      </div>
    </div>

  </div>
</body>
</html>`;
}
