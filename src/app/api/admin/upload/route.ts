import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/actions/admin";
import {
  uploadImage,
  validateImageFile,
  MAX_IMAGES,
  CloudinaryUploadResult,
} from "@/lib/cloudinary";

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

    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES} images allowed` },
        { status: 400 }
      );
    }

    // Validate all files before uploading
    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    // Upload all files to Cloudinary
    const results: CloudinaryUploadResult[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer, "products");
      results.push(result);
    }

    return NextResponse.json({
      urls: results.map((r) => r.secure_url),
      publicIds: results.map((r) => r.public_id),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
