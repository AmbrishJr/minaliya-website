import 'dotenv/config';
import ws from 'ws';
(global as any).WebSocket = ws;
import prisma from './src/lib/prisma';
import { generateInvoicePDF } from './src/lib/invoiceService';

async function testInvoice() {
  try {
    const order = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      where: {
          items: {
              some: {}
          }
      }
    });

    if (!order) {
      console.log('No orders found to test.');
      return;
    }

    console.log(`Testing invoice generation for Order ID: ${order.id}...`);
    
    // Force regeneration to test the Sparticuz chromium engine
    const result = await generateInvoicePDF(order.id, true);
    
    if (result.success) {
      console.log(`✅ Invoice generated successfully: ${result.url}`);
    } else {
      console.error(`❌ Invoice generation failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testInvoice();
