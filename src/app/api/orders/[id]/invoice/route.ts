import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import prisma from "@/lib/prisma";
import { generateInvoicePDF } from "@/lib/invoiceService";

const INVOICE_STORAGE_PATH = process.env.INVOICE_STORAGE_PATH || path.join(process.cwd(), 'public', 'invoices');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        invoiceNumber: true,
        invoiceGenerated: true,
        invoiceUrl: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const invoiceNumber = order.invoiceNumber || `INV-${id.slice(-8).toUpperCase()}`;
    const filePath = path.join(INVOICE_STORAGE_PATH, `${invoiceNumber}.pdf`);

    // Try to serve the local file first
    try {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Invoice-${invoiceNumber}.pdf"`,
        },
      });
    } catch {
      // Local file not found — generate on-demand
    }

    // Generate the PDF on-the-fly
    const pdfResult = await generateInvoicePDF(id);
    if (!pdfResult.success || !pdfResult.buffer) {
      return NextResponse.json({ error: "Failed to generate invoice PDF" }, { status: 500 });
    }

    // Save locally for future requests
    if (!existsSync(INVOICE_STORAGE_PATH)) {
      mkdirSync(INVOICE_STORAGE_PATH, { recursive: true });
    }
    await fs.writeFile(filePath, pdfResult.buffer);

    return new NextResponse(new Uint8Array(pdfResult.buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json({ error: "Failed to download invoice" }, { status: 500 });
  }
}
