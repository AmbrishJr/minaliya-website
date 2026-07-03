import { numberToWords } from "./numberToWords";

export interface InvoiceItem {
  sno: number;
  productName: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
  gstPercent: number;
  totalPrice: number;
}

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGst: string;
  companyFssai: string;
  logoUrl: string;

  invoiceNumber: string;
  orderId: string;
  invoiceDate: string;
  invoiceTime: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  customerState: string;
  customerPincode: string;

  items: InvoiceItem[];

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

function fmt(amount: number): string {
  return "\u20B9" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const totalQty = data.items.reduce((s, i) => s + i.quantity, 0);
  const totalDiscount = data.items.reduce((s, i) => s + i.discount, 0);
  const totalGstAmount = data.items.reduce(
    (s, i) => s + (i.pricePerUnit - i.discount) * i.quantity * (i.gstPercent / 100),
    0
  );
  const isIntraState = data.igst === 0;

  const itemRows = data.items
    .map(
      (item) => {
        const gstAmount = (item.pricePerUnit - item.discount) * item.quantity * (item.gstPercent / 100);
        return `
        <tr>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;">${item.sno}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;">${item.productName}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;">${item.hsnSac || "\u2014"}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;">${item.quantity.toFixed(2)}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;">${item.unit}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;">${fmt(item.pricePerUnit)}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;">${fmt(item.discount)}</td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;">${fmt(gstAmount)}<br><span style="font-size:11px;">(${item.gstPercent.toFixed(2)}%)</span></td>
          <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;font-weight:700;">${fmt(item.totalPrice)}</td>
        </tr>`;
      }
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Tax Invoice ${data.invoiceNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #F7F7F5;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #1A1A1A;
    padding: 40px;
  }
  .invoice {
    max-width: 900px;
    margin: 0 auto;
    background: #F7F7F5;
    padding: 40px 50px;
  }
  @page { size: A4; margin: 0; }

  .header { display: flex; justify-content: space-between; align-items: flex-start; }
  .company-name { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
  .company-details { font-size: 13px; color: #4A4A4A; line-height: 1.6; }

  .doc-title {
    text-align: center;
    color: #9A9A9A;
    letter-spacing: 3px;
    font-size: 14px;
    margin: 30px 0;
    text-transform: uppercase;
  }

  .meta-row { display: flex; justify-content: space-between; margin-bottom: 25px; }
  .bill-to .label { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
  .bill-to .details { font-size: 13px; color: #2A2A2A; line-height: 1.6; }
  .invoice-meta { text-align: right; font-size: 13px; line-height: 1.9; }
  .invoice-meta .k { color: #6B6B6B; }
  .invoice-meta .v { font-weight: 700; color: #1A1A1A; }

  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  thead th {
    background: #9B8FD9;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 13px;
    padding: 12px 10px;
    text-align: left;
  }
  thead th:first-child { border-radius: 4px 0 0 0; }
  thead th:last-child { border-radius: 0 4px 0 0; text-align: right; }
  th.num, td.num { text-align: right; }
  tbody td {
    padding: 14px 10px;
    font-size: 13px;
    border-bottom: 1px solid #E5E5E2;
  }
  .total-row td {
    font-weight: 700;
    font-size: 13px;
    padding-top: 14px;
    padding-bottom: 14px;
    border-top: 2px solid #1A1A1A;
    border-bottom: none;
  }

  .bottom-section { display: flex; justify-content: space-between; margin-top: 30px; }
  .left-col { max-width: 400px; }
  .section-label { font-weight: 700; font-size: 13px; margin-bottom: 6px; margin-top: 20px; }
  .section-label:first-child { margin-top: 0; }
  .section-text { font-size: 13px; color: #2A2A2A; }

  .summary { width: 300px; }
  .summary-row {
    display: flex; justify-content: space-between;
    font-size: 13px; padding: 6px 0;
  }
  .summary-row .k { color: #4A4A4A; font-weight: 600; }
  .summary-row .v { font-weight: 600; }
  .summary-row.emphasize .k,
  .summary-row.emphasize .v { font-weight: 700; color: #1A1A1A; }

  .footer {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-top: 60px;
  }
  .footer .note { font-size: 12px; color: #9A9A9A; }
  .footer .sign { text-align: right; font-size: 13px; }
  .footer .sign .for { font-weight: 700; margin-bottom: 40px; }
</style>
</head>
<body>
  <div class="invoice">

    <div class="header">
      <div>
        <div class="company-name">${data.companyName}</div>
        <div class="company-details">
          ${data.companyAddress}<br>
          FSSAI LICENSE NO: ${data.companyFssai}<br>
          GSTIN: ${data.companyGst}<br>
          Email: ${data.companyEmail}<br>
          Phone: ${data.companyPhone}
        </div>
      </div>
      <img src="${data.logoUrl}" alt="${data.companyName}" style="max-width:120px;height:auto;" />
    </div>

    <div class="doc-title">Tax Invoice</div>

    <div class="meta-row">
      <div class="bill-to">
        <div class="label">Bill To:</div>
        <div class="details">
          ${data.customerName}<br>
          ${data.billingAddress}<br>
          ${data.customerState}, ${data.customerPincode}<br>
          Ph: ${data.customerPhone}
        </div>
      </div>
      <div class="invoice-meta">
        <div><span class="k">Invoice Number: </span><span class="v">${data.invoiceNumber}</span></div>
        <div><span class="k">Order Id: </span><span class="v">${data.orderId}</span></div>
        <div><span class="k">Date: </span><span class="v">${data.invoiceDate}</span></div>
        <div><span class="k">Time: </span><span class="v">${data.invoiceTime}</span></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>SNo</th>
          <th>Item Name</th>
          <th class="num">HSN/SAC</th>
          <th class="num">Qty</th>
          <th>Unit</th>
          <th class="num">Price/Unit</th>
          <th class="num">Discount</th>
          <th class="num">GST</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr class="total-row">
          <td></td>
          <td>Total</td>
          <td></td>
          <td class="num">${totalQty.toFixed(2)}</td>
          <td></td>
          <td></td>
          <td class="num">${fmt(totalDiscount)}</td>
          <td class="num">${fmt(totalGstAmount)}</td>
          <td class="num">${fmt(data.grandTotal)}</td>
        </tr>
      </tbody>
    </table>

    <div class="bottom-section">
      <div class="left-col">
        <div class="section-label">INVOICE AMOUNT IN WORDS</div>
        <div class="section-text">${numberToWords(data.grandTotal)}</div>

        <div class="section-label">TERMS AND CONDITIONS</div>
        <div class="section-text">Terms and Conditions apply.</div>
      </div>

      <div class="summary">
        <div class="summary-row"><span class="k">Sub Total</span><span class="v">${fmt(data.subtotal)}</span></div>
        <div class="summary-row"><span class="k">Discount</span><span class="v">${fmt(data.couponDiscount)}</span></div>
        ${isIntraState ? `
        <div class="summary-row"><span class="k">SGST@2.50%</span><span class="v">${fmt(data.sgst)}</span></div>
        <div class="summary-row"><span class="k">CGST@2.50%</span><span class="v">${fmt(data.cgst)}</span></div>
        ` : `
        <div class="summary-row"><span class="k">IGST@5.00%</span><span class="v">${fmt(data.igst)}</span></div>
        `}
        <div class="summary-row"><span class="k">Round Off</span><span class="v">${fmt(data.roundOff)}</span></div>
        <div class="summary-row emphasize"><span class="k">Total Amount</span><span class="v">${fmt(data.grandTotal)}</span></div>
        <div class="summary-row emphasize"><span class="k">Received</span><span class="v">${fmt(data.amountPaid)}</span></div>
        <div class="summary-row emphasize"><span class="k">Balance</span><span class="v">${fmt(data.balance)}</span></div>
      </div>
    </div>

    <div class="footer">
      <div class="note">This is a computer generated invoice. No signature is required.</div>
      <div class="sign">
        <div class="for">For ${data.companyName}</div>
        <div>Authorized Signatory</div>
      </div>
    </div>

  </div>
</body>
</html>`;
}
