import { numberToWords } from "./numberToWords";

export interface InvoiceEmailItem {
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

export interface InvoiceEmailData {
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

  items: InvoiceEmailItem[];

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

export function generateInvoiceEmailHTML(data: InvoiceEmailData): string {
  const totalQty = data.items.reduce((s, i) => s + i.quantity, 0);
  const totalDiscount = data.items.reduce((s, i) => s + i.discount, 0);
  const totalGstAmount = data.items.reduce(
    (s, i) => s + (i.pricePerUnit - i.discount) * i.quantity * (i.gstPercent / 100),
    0
  );
  const isIntraState = data.igst === 0;

  const itemRows = data.items
    .map((item) => {
      const gstAmount =
        (item.pricePerUnit - item.discount) *
        item.quantity *
        (item.gstPercent / 100);
      return `<tr>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${item.sno}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${item.productName}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;color:#4A4A4A;font-family:'Helvetica Neue',Arial,sans-serif;">${item.hsnSac || "\u2014"}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${item.quantity.toFixed(2)}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:center;color:#4A4A4A;font-family:'Helvetica Neue',Arial,sans-serif;">${item.unit}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(item.pricePerUnit)}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(item.discount)}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(gstAmount)}<br><span style="font-size:11px;color:#4A4A4A;">(${item.gstPercent.toFixed(2)}%)</span></td>
        <td style="padding:14px 10px;border-bottom:1px solid #E5E5E2;font-size:13px;text-align:right;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(item.totalPrice)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tax Invoice ${data.invoiceNumber}</title>
<style>
  body{margin:0;padding:0;background-color:#F7F7F5;font-family:'Helvetica Neue',Arial,sans-serif;color:#1A1A1A;}
  @media only screen and (max-width:600px){
    .invoice{width:100%!important;padding:16px!important;}
    .logo{width:80px!important;}
    .company-name{font-size:20px!important;}
    td,th{font-size:11px!important;padding:8px 5px!important;}
  }
</style>
</head>
<body style="margin:0;padding:20px;background-color:#F7F7F5;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F7F7F5;">
<tr><td align="center" style="padding:20px 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="700" class="invoice" style="max-width:700px;width:100%;background:#F7F7F5;">

<!-- HEADER -->
<tr>
  <td style="padding:20px 10px 10px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="70%" valign="top">
          <p style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">${data.companyName}</p>
          <p style="margin:0 0 2px 0;font-size:12px;color:#4A4A4A;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">${data.companyAddress}</p>
          <p style="margin:0 0 2px 0;font-size:12px;color:#4A4A4A;font-family:'Helvetica Neue',Arial,sans-serif;">FSSAI LICENSE NO: ${data.companyFssai}</p>
          <p style="margin:0 0 2px 0;font-size:12px;color:#4A4A4A;font-family:'Helvetica Neue',Arial,sans-serif;">GSTIN: ${data.companyGst}</p>
          <p style="margin:0 0 2px 0;font-size:12px;color:#4A4A4A;font-family:'Helvetica Neue',Arial,sans-serif;">Email: ${data.companyEmail}</p>
          <p style="margin:0;font-size:12px;color:#4A4A4A;font-family:'Helvetica Neue',Arial,sans-serif;">Phone: ${data.companyPhone}</p>
        </td>
        <td width="30%" align="right" valign="top">
          <img src="${data.logoUrl}" alt="${data.companyName}" class="logo" width="120" style="max-width:120px;height:auto;display:block;" />
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- TAX INVOICE TITLE -->
<tr>
  <td align="center" style="padding:24px 10px 20px 10px;">
    <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;color:#9A9A9A;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Tax Invoice</p>
  </td>
</tr>

<!-- BILL TO + INVOICE META -->
<tr>
  <td style="padding:0 10px 20px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="55%" valign="top">
          <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">Bill To:</p>
          <p style="margin:0 0 2px 0;font-size:12px;color:#2A2A2A;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
            ${data.customerName}<br>
            ${data.billingAddress}<br>
            ${data.customerState}, ${data.customerPincode}<br>
            Ph: ${data.customerPhone}
          </p>
        </td>
        <td width="45%" valign="top" align="right">
          <p style="margin:0 0 4px 0;font-size:12px;color:#6B6B6B;font-family:'Helvetica Neue',Arial,sans-serif;">Invoice Number: <strong style="color:#1A1A1A;">${data.invoiceNumber}</strong></p>
          <p style="margin:0 0 4px 0;font-size:12px;color:#6B6B6B;font-family:'Helvetica Neue',Arial,sans-serif;">Order Id: <strong style="color:#1A1A1A;">${data.orderId}</strong></p>
          <p style="margin:0 0 4px 0;font-size:12px;color:#6B6B6B;font-family:'Helvetica Neue',Arial,sans-serif;">Date: <strong style="color:#1A1A1A;">${data.invoiceDate}</strong></p>
          <p style="margin:0;font-size:12px;color:#6B6B6B;font-family:'Helvetica Neue',Arial,sans-serif;">Time: <strong style="color:#1A1A1A;">${data.invoiceTime}</strong></p>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- ITEMS TABLE -->
<tr>
  <td style="padding:0 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:left;font-family:'Helvetica Neue',Arial,sans-serif;">SNo</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:left;font-family:'Helvetica Neue',Arial,sans-serif;">Item Name</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:center;font-family:'Helvetica Neue',Arial,sans-serif;">HSN/SAC</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:center;font-family:'Helvetica Neue',Arial,sans-serif;">Qty</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:center;font-family:'Helvetica Neue',Arial,sans-serif;">Unit</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">Price/Unit</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">Discount</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">GST</td>
        <td style="background-color:#9B8FD9;color:#FFFFFF;padding:12px 10px;font-size:12px;font-weight:700;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">Amount</td>
      </tr>
      ${itemRows}
      <tr>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;font-size:13px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;"></td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;font-size:13px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">Total</td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;"></td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;font-size:13px;font-weight:700;color:#1A1A1A;text-align:center;font-family:'Helvetica Neue',Arial,sans-serif;">${totalQty.toFixed(2)}</td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;"></td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;"></td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;font-size:13px;font-weight:700;color:#1A1A1A;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(totalDiscount)}</td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;font-size:13px;font-weight:700;color:#1A1A1A;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(totalGstAmount)}</td>
        <td style="padding:14px 10px;border-top:2px solid #1A1A1A;border-bottom:2px solid #1A1A1A;font-size:13px;font-weight:700;color:#1A1A1A;text-align:right;font-family:'Helvetica Neue',Arial,sans-serif;">${fmt(data.grandTotal)}</td>
      </tr>
    </table>
  </td>
</tr>

<!-- BOTTOM SECTION -->
<tr>
  <td style="padding:24px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="55%" valign="top" style="padding-right:10px;">
          <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">INVOICE AMOUNT IN WORDS</p>
          <p style="margin:0 0 20px 0;font-size:12px;color:#2A2A2A;line-height:1.5;font-family:'Helvetica Neue',Arial,sans-serif;">${numberToWords(data.grandTotal)}</p>
          <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">TERMS AND CONDITIONS</p>
          <p style="margin:0;font-size:12px;color:#2A2A2A;font-family:'Helvetica Neue',Arial,sans-serif;">Terms and Conditions apply.</p>
        </td>
        <td width="45%" valign="top">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:12px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <tr>
              <td style="padding:4px 0;color:#4A4A4A;font-weight:600;">Sub Total</td>
              <td style="padding:4px 0;text-align:right;color:#1A1A1A;font-weight:600;">${fmt(data.subtotal)}</td>
            </tr>
            ${data.couponDiscount > 0 ? `<tr>
              <td style="padding:4px 0;color:#4A4A4A;font-weight:600;">Discount</td>
              <td style="padding:4px 0;text-align:right;color:#1A1A1A;font-weight:600;">${fmt(data.couponDiscount)}</td>
            </tr>` : ''}
            ${isIntraState ? `
            <tr>
              <td style="padding:4px 0;color:#4A4A4A;font-weight:600;">SGST@2.50%</td>
              <td style="padding:4px 0;text-align:right;color:#1A1A1A;font-weight:600;">${fmt(data.sgst)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#4A4A4A;font-weight:600;">CGST@2.50%</td>
              <td style="padding:4px 0;text-align:right;color:#1A1A1A;font-weight:600;">${fmt(data.cgst)}</td>
            </tr>` : `
            <tr>
              <td style="padding:4px 0;color:#4A4A4A;font-weight:600;">IGST@5.00%</td>
              <td style="padding:4px 0;text-align:right;color:#1A1A1A;font-weight:600;">${fmt(data.igst)}</td>
            </tr>`}
            <tr>
              <td style="padding:4px 0;color:#4A4A4A;font-weight:600;">Round Off</td>
              <td style="padding:4px 0;text-align:right;color:#1A1A1A;font-weight:600;">${fmt(data.roundOff)}</td>
            </tr>
            <tr>
              <td style="padding:10px 0 4px 0;font-size:13px;font-weight:700;color:#1A1A1A;border-top:2px solid #1A1A1A;">Total Amount</td>
              <td style="padding:10px 0 4px 0;text-align:right;font-size:13px;font-weight:700;color:#1A1A1A;border-top:2px solid #1A1A1A;">${fmt(data.grandTotal)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;font-weight:700;color:#1A1A1A;">Received</td>
              <td style="padding:4px 0;text-align:right;font-size:13px;font-weight:700;color:#1A1A1A;">${fmt(data.amountPaid)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;font-weight:700;color:#1A1A1A;">Balance</td>
              <td style="padding:4px 0;text-align:right;font-size:13px;font-weight:700;color:#1A1A1A;">${fmt(data.balance)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- FOOTER -->
<tr>
  <td style="padding:40px 10px 10px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="50%" valign="bottom">
          <p style="margin:0;font-size:11px;color:#9A9A9A;font-family:'Helvetica Neue',Arial,sans-serif;">This is a computer generated invoice. No signature is required.</p>
        </td>
        <td width="50%" valign="bottom" align="right">
          <p style="margin:0 0 30px 0;font-size:12px;font-weight:700;color:#1A1A1A;font-family:'Helvetica Neue',Arial,sans-serif;">For ${data.companyName}</p>
          <p style="margin:0;font-size:12px;color:#2A2A2A;font-family:'Helvetica Neue',Arial,sans-serif;">Authorized Signatory</p>
        </td>
      </tr>
    </table>
  </td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
