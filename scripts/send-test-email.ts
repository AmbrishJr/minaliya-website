import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import path from "path";
import fs from "fs";
import { sendInvoiceEmail } from "../src/lib/email";

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), "public", "invoices");

async function main() {
  const order = await prisma.order.findFirst({
    where: { invoiceGenerated: true, invoiceNumber: "INV-2026-000004" },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    console.log("No order with generated invoice found");
    await prisma.$disconnect();
    return;
  }

  console.log(`Using order: ${order.id} (${order.invoiceNumber})`);

  const shippingAddress =
    typeof order.shippingAddress === "string"
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress;

  const modifiedOrder = {
    ...order,
    shippingAddress: {
      ...shippingAddress,
      email: "chairmadurai0804@gmail.com",
    },
  };

  console.log(`Sending test invoice email to chairmadurai0804@gmail.com...`);
  const result = await sendInvoiceEmail(modifiedOrder, order.items);
  console.log(`Result:`, JSON.stringify(result));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
