const EMAIL_API_URL = process.env.EMAIL_OTP_API_URL || "";
const EMAIL_USERID = process.env.EMAIL_OTP_USERID || "";
const EMAIL_PASSWORD = process.env.EMAIL_OTP_PASSWORD || "";
const EMAIL_FROM_NAME = process.env.EMAIL_OTP_FROM_NAME || "Minaliya";

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
): Promise<boolean> {
  if (!EMAIL_CONFIG_OK) {
    console.error(`[Email] Cannot send to ${recipientEmail}: EMAIL_OTP_* env vars not configured`);
    return false;
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
    return success;
  } catch (error) {
    console.error(`[Email] Failed to send to ${recipientEmail}:`, error);
    return false;
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

  return sendEmail(recipientEmail, subject, content);
}

export async function sendInvoiceEmail(order: any): Promise<boolean> {
  try {
    const shippingAddress = order.shippingAddress as Record<string, string>;
    const recipientEmail = shippingAddress?.email;
    const customerName = shippingAddress?.name || "Customer";

    if (!recipientEmail) {
      console.log(`[Email Invoice] No email address provided for order ${order.id}`);
      return false;
    }

    const orderId = order.id.slice(-8).toUpperCase();
    const invoiceNumber = order.invoiceNumber || "Pending";
    const amount = Number(order.totalAmount).toLocaleString("en-IN", { style: "currency", currency: "INR" });
    const paymentMethod = order.paymentMethod;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.minaliya.in";
    const downloadLink = `${baseUrl}/api/orders/${order.id}/invoice`;

    const subject = `Your Minaliya Order Confirmation & Invoice (#${orderId})`;

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
              <p style="margin:0 0 6px 0;font-size:14px;color:#6b7280;">Dear ${customerName},</p>
              <p style="margin:0 0 20px 0;font-size:18px;font-weight:600;color:#2d3e2f;">Thank you for shopping with Minaliya.</p>
              <p style="margin:0 0 16px 0;font-size:14px;color:#4b5563;line-height:1.6;">
                Your order has been successfully placed. Please find your order details and invoice below.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:24px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Order Number: <strong style="color:#2d3e2f;">${orderId}</strong></p>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Invoice Number: <strong style="color:#2d3e2f;">${invoiceNumber}</strong></p>
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Order Total: <strong style="color:#2d3e2f;">${amount}</strong></p>
                    <p style="margin:0;font-size:13px;color:#6b7280;">Payment Method: <strong style="color:#2d3e2f;">${paymentMethod}</strong></p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${downloadLink}" style="display:inline-block;background-color:#2d3e2f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;letter-spacing:0.5px;">Download Invoice PDF</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4b5563;line-height:1.6;">
                If the button above does not work, you can also download your invoice using this link: <br/>
                <a href="${downloadLink}" style="color:#2d3e2f;word-break:break-all;">${downloadLink}</a>
              </p>
              <p style="margin:0 0 4px 0;font-size:13px;color:#6b7280;line-height:1.6;">
                <strong>Note:</strong> If you have any questions, please contact us at
                <a href="tel:+919841422998" style="color:#2d3e2f;font-weight:600;text-decoration:none;">+91 98414 22998</a>
                or write to us at
                <a href="mailto:mailme@minaliya.in" style="color:#2d3e2f;font-weight:600;text-decoration:none;">mailme@minaliya.in</a>.
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

    return sendEmail(recipientEmail, subject, content);
  } catch (error) {
    console.error("[Email Invoice] Failed to send email:", error);
    return false;
  }
}

export async function sendShipmentEmail(order: any): Promise<boolean> {
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

    return sendEmail(recipientEmail, subject, content);
  } catch (error) {
    console.error("[Email Shipment] Failed to send email:", error);
    return false;
  }
}
