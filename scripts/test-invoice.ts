import 'dotenv/config';
import prisma from '../src/lib/prisma';
import { processInvoice, generateInvoicePDF } from '../src/lib/invoiceService';

async function main() {
  const orderId = process.argv[2];
  
  if (orderId) {
    console.log(`Testing invoice for order: ${orderId}`);
    await processInvoice(orderId);
    const updated = await prisma.order.findUnique({
      where: { id: orderId },
      select: { invoiceNumber: true, invoiceGenerated: true, invoiceUrl: true, invoiceSent: true },
    });
    console.log('Result:', JSON.stringify(updated, null, 2));
  } else {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        paymentStatus: true,
        invoiceGenerated: true,
        invoiceSent: true,
        invoiceNumber: true,
        invoiceUrl: true,
        createdAt: true,
      },
    });
    console.log('Recent orders:');
    console.log(JSON.stringify(orders, null, 2));
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
