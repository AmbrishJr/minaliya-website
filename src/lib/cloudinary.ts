import { v2 as cloudinary } from "cloudinary";

// ─── Configure Cloudinary ───────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Constants ──────────────────────────────────────────
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGES = 4;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

// ─── Validation ─────────────────────────────────────────

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File "${file.name}" exceeds the 5 MB size limit.`;
  }
  return null;
}

// ─── Upload ─────────────────────────────────────────────

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function uploadImage(
  buffer: Buffer,
  folder: string = "products",
  options: Record<string, unknown> = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload returned no result"));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );
    stream.end(buffer);
  });
}

// ─── Delete ─────────────────────────────────────────────

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    return false;
  }
}

export async function deleteImages(publicIds: string[]): Promise<void> {
  if (!publicIds.length) return;

  const results = await Promise.allSettled(
    publicIds.map((id) => deleteImage(id))
  );

  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length) {
    console.error(
      `Failed to delete ${failures.length}/${publicIds.length} Cloudinary images`
    );
  }
}

export default cloudinary;
