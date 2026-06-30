/**
 * Responsive HTML email invoice template for Minaliya Goods And Services.
 * Mirrors the existing PDF invoice design but optimized for email clients.
 * Uses table-based layout with inline CSS only — no external stylesheets.
 */

export interface InvoiceEmailItem {
  productName: string;
  productImage: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  hsnSac?: string;
  discount: number;
  gstPercent: number;
  totalPrice: number;
}

export interface InvoiceEmailData {
  // Company
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGst: string;
  companyFssai: string;
  logoUrl: string;

  // Order
  orderId: string;
  orderIdShort: string;
  invoiceNumber: string;
  orderDate: string;
  razorpayPaymentId: string;
  paymentMethod: string;
  paymentStatus: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  shippingAddress: string;
  customerState: string;
  customerPincode: string;

  // Items
  items: InvoiceEmailItem[];

  // Summary
  subtotal: number;
  couponDiscount: number;
  shippingCharges: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;

  // Links
  ordersPageUrl: string;
}

function fmt(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateInvoiceEmailHTML(data: InvoiceEmailData): string {
  const isIntraState = data.igst === 0;

  // Build item rows
  const itemRows = data.items
    .map((item, i) => {
      const lineTotal = item.totalPrice;
      const imgCell = item.productImage
        ? `<img src="${item.productImage}" alt="${item.productName}" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:8px;object-fit:cover;border:1px solid #e8e5e0;" />`
        : `<div style="width:48px;height:48px;border-radius:8px;background:#f0ede8;"></div>`;

      return `
        <tr>
          <td style="padding:14px 12px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:13px;color:#57534e;">${i + 1}</td>
          <td style="padding:14px 12px;border-bottom:1px solid #e8e5e0;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="vertical-align:middle;padding-right:12px;">${imgCell}</td>
                <td style="vertical-align:middle;">
                  <span style="font-size:13px;font-weight:600;color:#1c1917;">Minaliya Wooden Cold Pressed ${item.productName}</span>
                </td>
              </tr>
            </table>
          </td>
          <td style="padding:14px 12px;border-bottom:1px solid #e8e5e0;text-align:center;font-size:13px;color:#57534e;">${item.quantity}</td>
          <td style="padding:14px 12px;border-bottom:1px solid #e8e5e0;text-align:right;font-size:13px;color:#57534e;">${fmt(item.pricePerUnit)}</td>
          <td style="padding:14px 12px;border-bottom:1px solid #e8e5e0;text-align:right;font-size:13px;font-weight:600;color:#1c1917;">${fmt(lineTotal)}</td>
        </tr>`;
    })
    .join("");

  const totalQty = data.items.reduce((s, item) => s + item.quantity, 0);

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>Order Confirmation &amp; Invoice — ${data.invoiceNumber}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset for email clients */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    /* Mobile responsive */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-hide { display: none !important; }
      .mobile-font-sm { font-size: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f3ef;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <!-- Preheader text (hidden) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    Your Minaliya order #${data.orderIdShort} has been confirmed. Invoice ${data.invoiceNumber} — Total: ${fmt(data.grandTotal)}
  </div>

  <!-- WRAPPER -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f3ef;">
    <tr>
      <td align="center" style="padding:24px 16px;">

        <!-- EMAIL CONTAINER -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="email-container" style="max-width:600px;width:100%;margin:0 auto;">

          <!-- LOGO HEADER -->
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="background-color:#2d3e2f;border-radius:10px;padding:12px 32px;">
                    ${data.logoUrl
                      ? `<img src="${data.logoUrl}" alt="Minaliya" width="120" style="display:block;max-width:120px;height:auto;" />`
                      : `<span style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1.5px;font-family:'Segoe UI',Arial,sans-serif;">MINALIYA</span>`
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;overflow:hidden;">

              <!-- Greeting -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:40px 36px 0 36px;" class="mobile-padding">
                    <p style="margin:0 0 6px 0;font-size:14px;color:#6b7280;">Dear ${data.customerName},</p>
                    <p style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#2d3e2f;">Thank you for your order! 🎉</p>
                    <p style="margin:0 0 24px 0;font-size:14px;color:#4b5563;line-height:1.6;">
                      Your payment has been successfully verified and your order has been confirmed. Below is your complete order summary and invoice details.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- TAX INVOICE TITLE -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:0 36px 20px 36px;" class="mobile-padding">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="border-top:2px solid #a78bfa;border-bottom:2px solid #a78bfa;padding:10px 0;text-align:center;">
                          <span style="font-size:13px;font-weight:700;letter-spacing:2px;color:#7c3aed;text-transform:uppercase;">Tax Invoice</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- COMPANY + INVOICE DETAILS ROW -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:0 36px 20px 36px;" class="mobile-padding">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="55%" valign="top" class="mobile-stack" style="font-size:12px;color:#4b5563;line-height:1.6;">
                          <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#1c1917;">${data.companyName}</p>
                          <p style="margin:0 0 2px 0;">${data.companyAddress.replace(/,/g, ',<br/>')}</p>
                          <p style="margin:0 0 2px 0;">FSSAI Lic.No: ${data.companyFssai}</p>
                          <p style="margin:0 0 2px 0;">GST No: ${data.companyGst}</p>
                          <p style="margin:0 0 2px 0;">Email: ${data.companyEmail}</p>
                          <p style="margin:0;">Phone: ${data.companyPhone}</p>
                        </td>
                        <td width="45%" valign="top" class="mobile-stack" style="text-align:right;font-size:12px;color:#4b5563;line-height:1.8;">
                          <p style="margin:0;">Invoice No: <strong style="color:#1c1917;">${data.invoiceNumber}</strong></p>
                          <p style="margin:0;">Order ID: <strong style="color:#1c1917;">${data.orderIdShort}</strong></p>
                          <p style="margin:0;">Date: <strong style="color:#1c1917;">${data.orderDate}</strong></p>
                          <p style="margin:0;">Payment ID: <strong style="color:#1c1917;">${data.razorpayPaymentId || '—'}</strong></p>
                          <p style="margin:0;">Method: <strong style="color:#1c1917;">${data.paymentMethod}</strong></p>
                          <p style="margin:0;">Status: <strong style="color:#16a34a;">${data.paymentStatus}</strong></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- BILLING + SHIPPING -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:0 36px 24px 36px;" class="mobile-padding">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f7f4;border-radius:12px;">
                      <tr>
                        <td width="50%" valign="top" class="mobile-stack" style="padding:16px 20px;font-size:12px;color:#4b5563;line-height:1.6;">
                          <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#1c1917;text-transform:uppercase;letter-spacing:0.5px;">Bill To</p>
                          <p style="margin:0 0 2px 0;font-weight:600;color:#1c1917;">${data.customerName}</p>
                          <p style="margin:0 0 2px 0;">${data.billingAddress}</p>
                          <p style="margin:0 0 2px 0;">${data.customerState}, ${data.customerPincode}</p>
                          <p style="margin:0;">Ph: ${data.customerPhone}</p>
                        </td>
                        <td width="50%" valign="top" class="mobile-stack" style="padding:16px 20px;font-size:12px;color:#4b5563;line-height:1.6;">
                          <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#1c1917;text-transform:uppercase;letter-spacing:0.5px;">Ship To</p>
                          <p style="margin:0 0 2px 0;font-weight:600;color:#1c1917;">${data.customerName}</p>
                          <p style="margin:0 0 2px 0;">${data.shippingAddress}</p>
                          <p style="margin:0 0 2px 0;">${data.customerState}, ${data.customerPincode}</p>
                          <p style="margin:0;">Ph: ${data.customerPhone}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ITEMS TABLE -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:0 36px 8px 36px;" class="mobile-padding">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                      <!-- Header -->
                      <tr>
                        <td style="background-color:#a78bfa;color:#ffffff;padding:10px 12px;font-size:12px;font-weight:600;text-align:center;border-radius:8px 0 0 0;">SNo</td>
                        <td style="background-color:#a78bfa;color:#ffffff;padding:10px 12px;font-size:12px;font-weight:600;text-align:left;">Item Name</td>
                        <td style="background-color:#a78bfa;color:#ffffff;padding:10px 12px;font-size:12px;font-weight:600;text-align:center;">Qty</td>
                        <td style="background-color:#a78bfa;color:#ffffff;padding:10px 12px;font-size:12px;font-weight:600;text-align:right;">Price/Unit</td>
                        <td style="background-color:#a78bfa;color:#ffffff;padding:10px 12px;font-size:12px;font-weight:600;text-align:right;border-radius:0 8px 0 0;">Amount</td>
                      </tr>
                      <!-- Item rows -->
                      ${itemRows}
                      <!-- Totals row -->
                      <tr>
                        <td style="padding:12px;border-top:2px solid #1c1917;border-bottom:2px solid #1c1917;font-size:13px;font-weight:700;color:#1c1917;text-align:center;" colspan="2">Total</td>
                        <td style="padding:12px;border-top:2px solid #1c1917;border-bottom:2px solid #1c1917;font-size:13px;font-weight:700;color:#1c1917;text-align:center;">${totalQty}</td>
                        <td style="padding:12px;border-top:2px solid #1c1917;border-bottom:2px solid #1c1917;">&nbsp;</td>
                        <td style="padding:12px;border-top:2px solid #1c1917;border-bottom:2px solid #1c1917;font-size:13px;font-weight:700;color:#1c1917;text-align:right;">${fmt(data.grandTotal)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- SUMMARY SECTION -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:16px 36px 24px 36px;" class="mobile-padding">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <!-- Left: Amount in words + T&C -->
                        <td width="55%" valign="top" class="mobile-stack" style="padding-right:16px;">
                          <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#1c1917;text-transform:uppercase;letter-spacing:0.5px;">INVOICE AMOUNT IN WORDS</p>
                          <p style="margin:0 0 16px 0;font-size:12px;color:#4b5563;line-height:1.5;font-style:italic;">${amountInWords(data.grandTotal)} rupees only</p>
                          <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#1c1917;text-transform:uppercase;letter-spacing:0.5px;">TERMS AND CONDITIONS</p>
                          <p style="margin:0;font-size:12px;color:#4b5563;">Terms and Conditions apply.</p>
                        </td>
                        <!-- Right: Summary table -->
                        <td width="45%" valign="top" class="mobile-stack">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:12px;">
                            <tr>
                              <td style="padding:4px 0;font-weight:700;color:#1c1917;">Sub Total</td>
                              <td style="padding:4px 0;text-align:right;font-weight:700;color:#1c1917;">${fmt(data.subtotal)}</td>
                            </tr>
                            ${data.couponDiscount > 0 ? `
                            <tr>
                              <td style="padding:4px 0;font-weight:700;color:#1c1917;">Discount</td>
                              <td style="padding:4px 0;text-align:right;font-weight:700;color:#16a34a;">-${fmt(data.couponDiscount)}</td>
                            </tr>` : ''}
                            ${data.shippingCharges > 0 ? `
                            <tr>
                              <td style="padding:4px 0;font-weight:700;color:#1c1917;">Shipping</td>
                              <td style="padding:4px 0;text-align:right;font-weight:700;color:#1c1917;">${fmt(data.shippingCharges)}</td>
                            </tr>` : ''}
                            ${isIntraState ? `
                            <tr>
                              <td style="padding:4px 0;font-weight:700;color:#1c1917;">SGST@2.50%</td>
                              <td style="padding:4px 0;text-align:right;font-weight:700;color:#1c1917;">${fmt(data.sgst)}</td>
                            </tr>
                            <tr>
                              <td style="padding:4px 0;font-weight:700;color:#1c1917;">CGST@2.50%</td>
                              <td style="padding:4px 0;text-align:right;font-weight:700;color:#1c1917;">${fmt(data.cgst)}</td>
                            </tr>` : `
                            <tr>
                              <td style="padding:4px 0;font-weight:700;color:#1c1917;">IGST@5.00%</td>
                              <td style="padding:4px 0;text-align:right;font-weight:700;color:#1c1917;">${fmt(data.igst)}</td>
                            </tr>`}
                            <!-- Grand Total -->
                            <tr>
                              <td style="padding:10px 0 4px 0;font-size:14px;font-weight:700;color:#1c1917;border-top:2px solid #1c1917;">Total Amount</td>
                              <td style="padding:10px 0 4px 0;text-align:right;font-size:14px;font-weight:700;color:#1c1917;border-top:2px solid #1c1917;">${fmt(data.grandTotal)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- SIGNATORY -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:0 36px 8px 36px;" class="mobile-padding">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="50%" valign="bottom" style="font-size:10px;color:#9ca3af;">
                          This is a computer generated invoice.<br/>No signature is required.
                        </td>
                        <td width="50%" valign="bottom" style="text-align:right;">
                          <p style="margin:0 0 24px 0;font-size:12px;font-weight:700;color:#1c1917;">For Minaliya Goods And Services</p>
                          <p style="margin:0;font-size:12px;color:#4b5563;">Authorised Signatory</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- SEPARATOR -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:16px 36px;" class="mobile-padding">
                    <div style="border-top:1px solid #e5e4e0;"></div>
                  </td>
                </tr>
              </table>

              <!-- CTA BUTTON -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:0 36px 24px 36px;" class="mobile-padding">
                    <p style="margin:0 0 16px 0;font-size:14px;color:#4b5563;line-height:1.6;">
                      You can download your invoice PDF or track your order anytime from your account.
                    </p>
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${data.ordersPageUrl}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="17%" stroke="f" fillcolor="#2d3e2f">
                      <w:anchorlock/>
                      <center>
                        <![endif]-->
                    <a href="${data.ordersPageUrl}" style="display:inline-block;background-color:#2d3e2f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 32px;border-radius:8px;letter-spacing:0.5px;mso-padding-alt:0;text-underline-color:#2d3e2f;">View My Orders</a>
                    <!--[if mso]>
                      </center>
                    </v:roundrect>
                    <![endif]-->
                  </td>
                </tr>
              </table>

              <!-- FOOTER INSIDE CARD -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background-color:#f8f7f4;border-radius:0 0 16px 16px;padding:24px 36px;" class="mobile-padding">
                    <p style="margin:0 0 4px 0;font-size:14px;color:#2d3e2f;font-weight:600;">Regards,</p>
                    <p style="margin:0 0 2px 0;font-size:14px;color:#4b5563;font-weight:600;">Team Minaliya</p>
                    <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Minaliya Goods And Services</p>
                    <p style="margin:0 0 12px 0;font-size:12px;color:#6b7280;">Chennai, Tamil Nadu, India</p>
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="font-size:12px;color:#6b7280;padding-right:4px;">&#9993;</td>
                        <td><a href="mailto:mailme@minaliya.in" style="font-size:12px;color:#2d3e2f;text-decoration:none;">mailme@minaliya.in</a></td>
                        <td style="padding:0 8px;font-size:12px;color:#9ca3af;">|</td>
                        <td style="font-size:12px;color:#6b7280;padding-right:4px;">&#9742;</td>
                        <td><a href="tel:+919841422998" style="font-size:12px;color:#2d3e2f;text-decoration:none;">+91 98414 22998</a></td>
                        <td style="padding:0 8px;font-size:12px;color:#9ca3af;">|</td>
                        <td style="font-size:12px;color:#6b7280;padding-right:4px;">&#127760;</td>
                        <td><a href="https://www.minaliya.com" style="font-size:12px;color:#2d3e2f;text-decoration:none;">www.minaliya.com</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          <!-- END MAIN CARD -->

          <!-- DISCLAIMER -->
          <tr>
            <td style="padding:20px 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="border-top:1px solid #d6d5d0;padding-top:16px;">
                    <p style="margin:0 0 8px 0;font-size:11px;color:#9ca3af;line-height:1.5;">
                      <strong style="color:#6b7280;">Disclaimer:</strong><br/>
                      This email is generated automatically for informational purposes only and should not be considered as an acknowledgment, authentication, or approval of any transaction beyond the verification request initiated by you.
                    </p>
                    <p style="margin:0 0 8px 0;font-size:11px;color:#9ca3af;line-height:1.5;">
                      The information contained in this email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify the sender immediately and delete it from your system.
                    </p>
                    <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
                      Minaliya Goods And Services shall not be liable for any direct or indirect loss arising from the use of, or reliance upon, the information contained in this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- COPYRIGHT -->
          <tr>
            <td align="center" style="padding:20px 0 0 0;">
              <p style="margin:0;font-size:11px;color:#b0afa8;">&copy; 2026 Minaliya Goods And Services. All rights reserved.</p>
            </td>
          </tr>

        </table>
        <!-- END EMAIL CONTAINER -->

      </td>
    </tr>
  </table>
  <!-- END WRAPPER -->
</body>
</html>`;
}

/**
 * Simple number-to-words for Indian currency amounts.
 * Falls back to numeral if the import isn't available.
 */
function amountInWords(amount: number): string {
  try {
    // Dynamic require to reuse existing utility
    const { numberToWords } = require('./numberToWords');
    return numberToWords(amount);
  } catch {
    // Fallback: just return the formatted number
    return fmt(amount);
  }
}
