import "dotenv/config";
import { generateInvoiceEmailHTML } from "../src/lib/invoiceEmailTemplate";

const EMAIL_API_URL = process.env.EMAIL_OTP_API_URL || "";
const EMAIL_USERID = process.env.EMAIL_OTP_USERID || "";
const EMAIL_PASSWORD = process.env.EMAIL_OTP_PASSWORD || "";
const EMAIL_FROM_NAME = process.env.EMAIL_OTP_FROM_NAME || "Minaliya";

async function sendEmail(recipientEmail: string, subject: string, content: string): Promise<boolean> {
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
  console.log(`Response: ${text}`);
  return response.ok && text.toLowerCase().startsWith("success");
}

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.minaliya.in";

  const content = generateInvoiceEmailHTML({
    companyName: "Minaliya Goods And Services",
    companyAddress: "Old No 87, New No 78, Shop No 3, Kodambakkam Road,<br>Mettupalayam, West Mambalam, Chennai - 600033,<br>Tamil Nadu, India",
    companyPhone: "+91 98414 22998",
    companyEmail: "mailme@minaliya.in",
    companyGst: "33APKPD8864Q3Z3",
    companyFssai: "12423002001621",
    logoUrl: `${baseUrl}/logo.png`,
    invoiceNumber: "INV-2026-DEMO-001",
    orderId: "DEMO-ORDER-001",
    invoiceDate: "30/06/2026",
    invoiceTime: "2:30 PM",
    customerName: "Demo Customer",
    customerEmail: "chairmadurai0804@gmail.com",
    customerPhone: "+91 98765 43210",
    billingAddress: "123 Demo Street, T. Nagar",
    customerState: "Tamil Nadu",
    customerPincode: "600017",
    items: [
      {
        sno: 1,
        productName: "Minaliya Wooden Cold Pressed Groundnut Oil",
        hsnSac: "15089091",
        quantity: 1,
        unit: "NOS",
        pricePerUnit: 460,
        discount: 0,
        gstPercent: 5,
        totalPrice: 460,
      },
      {
        sno: 2,
        productName: "Minaliya Wooden Cold Pressed Sesame Oil",
        hsnSac: "15155091",
        quantity: 2,
        unit: "NOS",
        pricePerUnit: 540,
        discount: 0,
        gstPercent: 5,
        totalPrice: 1080,
      },
    ],
    subtotal: 1540,
    couponDiscount: 0,
    shippingCharges: 0,
    cgst: 38.5,
    sgst: 38.5,
    igst: 0,
    roundOff: 0,
    grandTotal: 1617,
    amountPaid: 1617,
    balance: 0,
  });

  const subject = "Tax Invoice - INV-2026-DEMO-001 - Minaliya Goods And Services";
  const success = await sendEmail("chairmadurai0804@gmail.com", subject, content);
  console.log(success ? "Email sent successfully!" : "Email failed to send.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
