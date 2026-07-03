require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const path = require("path");
const fs = require("fs");

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), "public", "invoices");

async function main() {
  const order = await prisma.order.findFirst({
    where: { invoiceGenerated: true, invoiceNumber: { not: null } },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (!order) {
    console.log("No order with generated invoice found");
    await prisma.$disconnect();
    return;
  }

  console.log(`Using order: ${order.id} (${order.invoiceNumber})`);

  const pdfPath = path.join(INVOICE_STORAGE_PATH, `${order.invoiceNumber}.pdf`);
  if (!fs.existsSync(pdfPath)) {
    console.log(`PDF not found at: ${pdfPath}`);
    await prisma.$disconnect();
    return;
  }

  const pdfBuffer = fs.readFileSync(pdfPath);

  // Override recipient email to test address
  const modifiedOrder = {
    ...order,
    shippingAddress: {
      ...(typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress),
      email: "chairmadurai0804@gmail.com",
    },
  };

  // Dynamically import sendInvoiceEmail
  const { sendInvoiceEmail } = require("./src/lib/email");

  console.log(`Sending test invoice email to chairmadurai0804@gmail.com...`);
  const result = await sendInvoiceEmail(modifiedOrder, pdfBuffer);
  console.log(`Result:`, JSON.stringify(result));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
