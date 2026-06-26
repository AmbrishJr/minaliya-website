import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdminSession } from "@/actions/admin";

export async function POST(req: NextRequest) {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json({ error: "Maximum 4 images allowed" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "products");
    await mkdir(uploadDir, { recursive: true });

    const savedUrls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .toLowerCase();

      const uniqueName = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      savedUrls.push(`/products/${uniqueName}`);
    }

    return NextResponse.json({ urls: savedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
