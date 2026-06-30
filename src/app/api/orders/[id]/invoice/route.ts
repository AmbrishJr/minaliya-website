import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/actions/admin";

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
        shippingAddress: true,
        userId: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.invoiceGenerated || !order.invoiceNumber) {
      return NextResponse.json({ error: "Invoice not generated yet" }, { status: 404 });
    }

    // Auth: allow admin or the customer who placed the order
    const { isAdmin } = await verifyAdminSession();
    let isOwner = false;

    const addr = order.shippingAddress as Record<string, string>;

    if (order.userId) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const userEmail = cookieStore.get("email")?.value;
        const userPhone = cookieStore.get("phone")?.value;

        if (userEmail && addr.email?.toLowerCase() === userEmail.toLowerCase()) {
          isOwner = true;
        }
        if (!isOwner && userPhone) {
          const cleanPhone = userPhone.replace(/\D/g, "");
          const cleanAddrPhone = (addr.phone || "").replace(/\D/g, "");
          if (cleanPhone && cleanAddrPhone && cleanAddrPhone.includes(cleanPhone)) {
            isOwner = true;
          }
        }
      } catch {
        // Cookie read failed — not logged in
      }
    }

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(INVOICE_STORAGE_PATH, `${order.invoiceNumber}.pdf`);

    try {
      const fileBuffer = await fs.readFile(filePath);

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Invoice-${order.invoiceNumber}.pdf"`,
        },
      });
    } catch {
      return NextResponse.json({ error: "Invoice file not found on server" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json({ error: "Failed to download invoice" }, { status: 500 });
  }
}
