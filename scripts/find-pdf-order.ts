import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import path from "path";
import fs from "fs";

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), "public", "invoices");

async function main() {
  const orders = await prisma.order.findMany({
    where: { invoiceGenerated: true, invoiceNumber: { not: null } },
    select: { id: true, invoiceNumber: true },
    orderBy: { createdAt: "desc" },
  });

  console.log("Orders with invoiceGenerated=true:");
  for (const o of orders) {
    const pdfPath = path.join(INVOICE_STORAGE_PATH, `${o.invoiceNumber}.pdf`);
    const exists = fs.existsSync(pdfPath);
    console.log(`  ${o.id.slice(-8)} | ${o.invoiceNumber} | PDF on disk: ${exists}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
