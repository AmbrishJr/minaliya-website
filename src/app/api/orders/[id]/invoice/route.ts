import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateInvoicePDF } from "@/lib/invoiceService";

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

    // Always serve through our endpoint with proper PDF headers
    // generateInvoicePDF handles fetching from Cloudinary if already generated
    const pdfResult = await generateInvoicePDF(id);
    if (!pdfResult.success || !pdfResult.buffer) {
      return NextResponse.json({ error: pdfResult.error || "Failed to generate invoice PDF" }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(pdfResult.buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Invoice-${invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json({ error: "Failed to download invoice" }, { status: 500 });
  }
}
