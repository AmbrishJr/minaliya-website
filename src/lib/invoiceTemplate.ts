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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #000000;
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-size: 11px;
    }

    @page {
      size: A4;
      margin: 10mm;
    }

    .invoice-container {
      max-width: 100%;
      margin: 0 auto;
      background: #ffffff;
      padding: 0;
    }

    .header-table { width: 100%; margin-bottom: 20px; }
    .company-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .company-details { line-height: 1.4; color: #333; }
    
    .invoice-title {
      text-align: center;
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }

    .meta-table { width: 100%; margin-bottom: 20px; }
    .meta-table td { vertical-align: top; }
    .meta-right { text-align: right; line-height: 1.5; font-size: 10px; }
    .meta-right strong { font-weight: 600; }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 10px;
    }
    .items-table th {
      background-color: #a78bfa; /* Light purple matching the image */
      color: #ffffff;
      padding: 8px 6px;
      font-weight: 600;
      text-align: center;
      border: 1px solid #ddd;
    }
    .items-table td {
      padding: 8px 6px;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    .items-table .text-left { text-align: left; }
    .items-table .text-right { text-align: right; }
    
    .totals-row td {
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      font-weight: 700;
      padding: 8px 6px;
    }

    .summary-section { width: 100%; margin-top: 20px; }
    .summary-left { width: 60%; vertical-align: top; padding-right: 20px; }
    .summary-right { width: 40%; vertical-align: top; }

    .summary-table { width: 100%; border-collapse: collapse; font-size: 11px; }
    .summary-table td { padding: 4px 0; }
    .summary-table .amount { text-align: right; font-weight: 600; }
    
    .words-box { margin-bottom: 15px; }
    .words-title { font-weight: 700; margin-bottom: 4px; }
    
    .footer-section { width: 100%; margin-top: 40px; }
    .signatory { text-align: right; }
    .signatory-title { font-weight: 700; margin-bottom: 40px; }
    
    .computer-gen { font-size: 9px; color: #666; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="invoice-container">

    <!-- HEADER -->
    <table class="header-table">
      <tr>
        <td width="70%" valign="top">
          <div class="company-name">${data.companyName}</div>
          <div class="company-details">
            ${data.companyAddress.replace(/,/g, ',<br/>')}<br />
            FSSAI Lic.No : ${data.companyFssai}<br />
            GSTIN/UIN: ${data.companyGst}<br />
            Email: ${data.companyEmail}<br />
            Phone: ${data.companyPhone}
          </div>
        </td>
        <td width="30%" valign="top" style="text-align:right;">
          ${data.logoUrl 
            ? `<img src="${data.logoUrl}" style="max-width:120px; max-height:80px; object-fit:contain;" />` 
            : `<h2 style="color:#e11d48; margin:0;">MINALIYA</h2>`
          }
        </td>
      </tr>
    </table>

    <div class="invoice-title">Tax Invoice</div>

    <!-- META INFO -->
    <table class="meta-table">
      <tr>
        <td width="60%">
          <!-- Bill to / Ship to could go here if needed, but the design focuses on meta -->
          <div style="font-weight:700; margin-bottom:4px;">Bill To:</div>
          <div>${data.customerName}</div>
          <div>${data.billingAddress}</div>
          <div>${data.customerState}, ${data.customerPincode}</div>
          <div>Ph: ${data.customerPhone}</div>
        </td>
        <td width="40%" class="meta-right">
          <div>Invoice Number: <strong>${data.invoiceNumber}</strong></div>
          <div>Order Id: <strong>${data.orderId}</strong></div>
          <div>Date: <strong>${data.invoiceDate}</strong></div>
          <div>Time: <strong>${data.invoiceTime}</strong></div>
        </td>
      </tr>
    </table>

    <!-- ITEMS -->
    <table class="items-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th class="text-left">Product Name</th>
          <th>HSN / SAC</th>
          <th>Qty</th>
          <th class="text-right">Rate</th>
          <th>Discount %</th>
          <th class="text-right">Total Rate</th>
          <th>GST %</th>
          <th class="text-right">Total Amt</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map((item) => `
        <tr>
          <td>${item.sno}</td>
          <td class="text-left">Minaliya Wooden Cold Pressed ${item.productName}</td>
          <td>${item.hsnSac || "—"}</td>
          <td>${item.quantity} ${item.unit}</td>
          <td class="text-right">${formatCurrency(item.pricePerUnit)}</td>
          <td>${item.discount > 0 ? ((item.discount / item.pricePerUnit) * 100).toFixed(0) : "0"}</td>
          <td class="text-right">${formatCurrency((item.pricePerUnit - item.discount) * item.quantity)}</td>
          <td>${item.gstPercent}</td>
          <td class="text-right">${formatCurrency(item.totalPrice)}</td>
        </tr>
        `).join('')}
        <tr class="totals-row">
          <td colspan="3" class="text-left">Total</td>
          <td>${data.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
          <td colspan="4"></td>
          <td class="text-right">${formatCurrency(data.grandTotal)}</td>
        </tr>
      </tbody>
    </table>

    <!-- SUMMARY -->
    <table class="summary-section">
      <tr>
        <td class="summary-left">
          <div class="words-box">
            <div class="words-title">Total Amount (in words)</div>
            <div>${numberToWords(data.grandTotal)}</div>
          </div>
          <div style="margin-top:20px; line-height:1.6;">
            <div>* Terms and conditions apply</div>
            <div><strong>Place Of Supply:</strong> ${data.placeOfSupply}</div>
          </div>
        </td>
        <td class="summary-right">
          <table class="summary-table">
            <tr>
              <td>Sub Total</td>
              <td class="amount">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td class="amount">${formatCurrency(data.couponDiscount)}</td>
            </tr>
            ${isIntraState ? `
            <tr>
              <td>SGST 2.5%</td>
              <td class="amount">${formatCurrency(data.sgst)}</td>
            </tr>
            <tr>
              <td>CGST 2.5%</td>
              <td class="amount">${formatCurrency(data.cgst)}</td>
            </tr>
            ` : `
            <tr>
              <td>IGST 5%</td>
              <td class="amount">${formatCurrency(data.igst)}</td>
            </tr>
            `}
            <tr>
              <td>Round Off</td>
              <td class="amount">${formatCurrency(data.roundOff)}</td>
            </tr>
            <tr>
              <td style="font-weight:700; border-top:1px solid #000; border-bottom:1px solid #000; padding:6px 0;">Total Amount</td>
              <td class="amount" style="font-weight:700; border-top:1px solid #000; border-bottom:1px solid #000; padding:6px 0;">${formatCurrency(data.grandTotal)}</td>
            </tr>
            <tr>
              <td style="padding-top:10px;">Amt Received</td>
              <td class="amount" style="padding-top:10px;">${formatCurrency(data.amountPaid)}</td>
            </tr>
            <tr>
              <td>Balance</td>
              <td class="amount" style="font-weight:700;">${formatCurrency(data.balance)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- FOOTER -->
    <table class="footer-section">
      <tr>
        <td width="50%" valign="bottom">
          <div class="computer-gen">This is a computer generated invoice. No signature is required.</div>
        </td>
        <td width="50%" class="signatory" valign="bottom">
          <div class="signatory-title">For Minaliya Goods And Services</div>
          <div>Auth Signatory</div>
        </td>
      </tr>
    </table>

  </div>
</body>
</html>`;
}
