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
  invoiceUrl?: string;
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
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:center;color:#111111;font-family:Arial,sans-serif;">${item.sno}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;color:#111111;font-family:Arial,sans-serif;">${item.productName}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:center;color:#666666;font-family:Arial,sans-serif;">${item.hsnSac || "\u2014"}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:center;color:#111111;font-family:Arial,sans-serif;">${item.quantity.toFixed(2)}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:center;color:#666666;font-family:Arial,sans-serif;">${item.unit}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:right;color:#111111;font-family:Arial,sans-serif;">${fmt(item.pricePerUnit)}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:right;color:#111111;font-family:Arial,sans-serif;">${fmt(item.discount)}</td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:right;color:#111111;font-family:Arial,sans-serif;">${fmt(gstAmount)}<br><span style="font-size:12px;color:#666666;">(${item.gstPercent.toFixed(2)}%)</span></td>
        <td style="padding:14px 8px;border-bottom:1px solid #E5E5E5;font-size:15px;text-align:right;font-weight:700;color:#111111;font-family:Arial,sans-serif;">${fmt(item.totalPrice)}</td>
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
  body{margin:0;padding:0;background-color:#FFFFFF;font-family:Arial,sans-serif;color:#111111;}
  @media only screen and (max-width:600px){
    .invoice{width:100%!important;padding:16px!important;}
    .logo{width:80px!important;}
    .company-name{font-size:20px!important;}
    td,th{font-size:11px!important;padding:8px 5px!important;}
  }
</style>
</head>
<body style="margin:0;padding:20px;background-color:#FFFFFF;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#FFFFFF;">
<tr><td align="center" style="padding:20px 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="700" class="invoice" style="max-width:700px;width:100%;background:#FFFFFF;">

<!-- HEADER -->
<tr>
  <td style="padding:20px 10px 10px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="70%" valign="top">
          <p style="margin:0 0 8px 0;font-size:28px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">${data.companyName}</p>
          <p style="margin:0 0 8px 0;font-size:16px;color:#111111;line-height:1.6;font-family:Arial,sans-serif;">${data.companyAddress}</p>
          <p style="margin:0 0 2px 0;font-size:15px;color:#111111;font-family:Arial,sans-serif;">FSSAI LICENSE NO: ${data.companyFssai}</p>
          <p style="margin:0 0 2px 0;font-size:15px;color:#111111;font-family:Arial,sans-serif;">GSTIN: ${data.companyGst}</p>
          <p style="margin:0 0 2px 0;font-size:15px;color:#111111;font-family:Arial,sans-serif;">Email: ${data.companyEmail}</p>
          <p style="margin:0;font-size:15px;color:#111111;font-family:Arial,sans-serif;">Phone: ${data.companyPhone}</p>
        </td>
        <td width="30%" align="right" valign="top">
          <img src="${data.logoUrl}" alt="${data.companyName}" class="logo" width="95" style="max-width:95px;height:auto;display:block;" />
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- TAX INVOICE TITLE -->
<tr>
  <td align="center" style="padding:30px 10px;">
    <p style="margin:0;font-size:24px;font-weight:500;letter-spacing:4px;color:#666666;text-transform:uppercase;font-family:Arial,sans-serif;">Tax Invoice</p>
  </td>
</tr>

<!-- BILL TO + INVOICE META -->
<tr>
  <td style="padding:0 10px 25px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="55%" valign="top">
          <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">Bill To:</p>
          <p style="margin:0 0 2px 0;font-size:15px;color:#111111;line-height:1.8;font-family:Arial,sans-serif;">
            ${data.customerName}<br>
            ${data.billingAddress}<br>
            ${data.customerState}, ${data.customerPincode}<br>
            Ph: ${data.customerPhone}
          </p>
        </td>
        <td width="45%" valign="top" align="right">
          <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">Invoice Information</p>
          <p style="margin:0 0 4px 0;font-size:15px;color:#111111;font-family:Arial,sans-serif;"><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
          <p style="margin:0 0 4px 0;font-size:15px;color:#111111;font-family:Arial,sans-serif;"><strong>Order ID:</strong> ${data.orderId}</p>
          <p style="margin:0 0 4px 0;font-size:15px;color:#111111;font-family:Arial,sans-serif;"><strong>Date:</strong> ${data.invoiceDate}</p>
          <p style="margin:0;font-size:15px;color:#111111;font-family:Arial,sans-serif;"><strong>Time:</strong> ${data.invoiceTime}</p>
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
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:center;font-family:Arial,sans-serif;">SNo</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:left;font-family:Arial,sans-serif;">Item Name</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:center;font-family:Arial,sans-serif;">HSN/SAC</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:center;font-family:Arial,sans-serif;">Qty</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:center;font-family:Arial,sans-serif;">Unit</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:right;font-family:Arial,sans-serif;">Price/Unit</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:right;font-family:Arial,sans-serif;">Discount</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:right;font-family:Arial,sans-serif;">GST</td>
        <td style="background-color:#A68CF3;color:#FFFFFF;padding:12px 8px;font-size:15px;font-weight:700;text-align:right;font-family:Arial,sans-serif;">Amount</td>
      </tr>
      ${itemRows}
      <tr>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;font-size:16px;font-weight:700;color:#111111;font-family:Arial,sans-serif;"></td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;font-size:16px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">Total</td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;"></td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;font-size:16px;font-weight:700;color:#111111;text-align:center;font-family:Arial,sans-serif;">${totalQty.toFixed(2)}</td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;"></td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;"></td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;font-size:16px;font-weight:700;color:#111111;text-align:right;font-family:Arial,sans-serif;">${fmt(totalDiscount)}</td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;font-size:16px;font-weight:700;color:#111111;text-align:right;font-family:Arial,sans-serif;">${fmt(totalGstAmount)}</td>
        <td style="padding:14px 8px;border-top:2px solid #111111;border-bottom:2px solid #111111;font-size:16px;font-weight:700;color:#111111;text-align:right;font-family:Arial,sans-serif;">${fmt(data.grandTotal)}</td>
      </tr>
    </table>
  </td>
</tr>

<!-- BOTTOM SECTION -->
<tr>
  <td style="padding:30px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="60%" valign="top" style="padding-right:10px;">
          <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">INVOICE AMOUNT IN WORDS</p>
          <p style="margin:0 0 28px 0;font-size:15px;color:#111111;line-height:1.6;font-family:Arial,sans-serif;">${numberToWords(data.grandTotal)}</p>
          <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">TERMS AND CONDITIONS</p>
          <p style="margin:0;font-size:15px;color:#111111;font-family:Arial,sans-serif;">Terms and Conditions apply.</p>
        </td>
        <td width="40%" valign="top">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:15px;font-family:Arial,sans-serif;">
            <tr>
              <td style="padding:6px 0;color:#111111;font-weight:600;">Sub Total</td>
              <td style="padding:6px 0;text-align:right;color:#111111;font-weight:600;">${fmt(data.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#111111;font-weight:600;">Discount</td>
              <td style="padding:6px 0;text-align:right;color:#111111;font-weight:600;">${fmt(data.couponDiscount)}</td>
            </tr>
            ${isIntraState ? `
            <tr>
              <td style="padding:6px 0;color:#111111;font-weight:600;">SGST@2.50%</td>
              <td style="padding:6px 0;text-align:right;color:#111111;font-weight:600;">${fmt(data.sgst)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#111111;font-weight:600;">CGST@2.50%</td>
              <td style="padding:6px 0;text-align:right;color:#111111;font-weight:600;">${fmt(data.cgst)}</td>
            </tr>` : `
            <tr>
              <td style="padding:6px 0;color:#111111;font-weight:600;">IGST@5.00%</td>
              <td style="padding:6px 0;text-align:right;color:#111111;font-weight:600;">${fmt(data.igst)}</td>
            </tr>`}
            <tr>
              <td style="padding:6px 0;color:#111111;font-weight:600;">Round Off</td>
              <td style="padding:6px 0;text-align:right;color:#111111;font-weight:600;">${fmt(data.roundOff)}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 6px 0;font-size:16px;font-weight:700;color:#111111;border-top:2px solid #111111;">Total Amount</td>
              <td style="padding:12px 0 6px 0;text-align:right;font-size:16px;font-weight:700;color:#111111;border-top:2px solid #111111;">${fmt(data.grandTotal)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:16px;font-weight:700;color:#111111;">Received</td>
              <td style="padding:6px 0;text-align:right;font-size:16px;font-weight:700;color:#111111;">${fmt(data.amountPaid)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:16px;font-weight:700;color:#111111;">Balance</td>
              <td style="padding:6px 0;text-align:right;font-size:16px;font-weight:700;color:#111111;">${fmt(data.balance)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- FOOTER -->
<tr>
  <td style="padding:50px 10px 10px 10px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td width="50%" valign="bottom">
          <p style="margin:0;font-size:13px;color:#666666;font-family:Arial,sans-serif;">This is a computer generated invoice.<br>No signature is required.</p>
        </td>
        <td width="50%" valign="bottom" align="right">
          <p style="margin:0 0 40px 0;font-size:15px;font-weight:700;color:#111111;font-family:Arial,sans-serif;">For ${data.companyName}</p>
          <p style="margin:0;font-size:15px;color:#111111;font-family:Arial,sans-serif;">Authorized Signatory</p>
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
