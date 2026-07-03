import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePDF } from "@/lib/invoiceService";
import { verifyAdminSession } from "@/actions/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin } = await verifyAdminSession();
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const result = await generateInvoicePDF(id, true); // force regenerate
    
    if (result.success) {
      return NextResponse.json({ success: true, url: result.url });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error regenerating invoice:", error);
    return NextResponse.json({ error: "Failed to regenerate invoice" }, { status: 500 });
  }
}
