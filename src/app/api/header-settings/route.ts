import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/actions/admin";
import { getHeaderSettings } from "@/lib/header-data";
import prisma from "@/lib/prisma";

export async function GET() {
  const settings = await getHeaderSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await prisma.headerSettings.upsert({
      where: { id: "default" },
      create: { id: "default", data: body },
      update: { data: body },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating header settings:", error);
    return NextResponse.json({ error: "Failed to update header settings" }, { status: 500 });
  }
}
