import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as path from "path";
import * as fs from "fs/promises";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFileToCloudinary(filePath: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return null;
  }
}

async function migrateProducts() {
  console.log("Migrating products...");
  const products = await prisma.product.findMany();
  let migrated = 0;

  for (const product of products) {
    console.log(`Processing product: ${product.name}`);
    const newImages: string[] = [];
    const newPublicIds: string[] = [];
    let needsUpdate = false;

    for (const image of product.images) {
      if (image.startsWith("/products/")) {
        // Needs migration
        const filePath = path.join(process.cwd(), "public", image.replace(/^\//, ""));
        try {
          // Check if file exists locally
          await fs.access(filePath);
          console.log(`Uploading ${filePath}...`);
          const result = await uploadFileToCloudinary(filePath, "products");

          if (result) {
            newImages.push(result.secure_url);
            newPublicIds.push(result.public_id);
            needsUpdate = true;
          } else {
            // Keep original on failure
            newImages.push(image);
            // We can't safely assign a public_id here, but product.imagePublicIds might be out of sync anyway if we are migrating
            newPublicIds.push("");
          }
        } catch (e) {
          console.warn(`File not found or access error for ${image}:`, e);
          newImages.push(image);
          newPublicIds.push("");
        }
      } else {
        // Already migrated or remote
        newImages.push(image);
        // Assuming if it's already an absolute URL, its public_id might not be tracked correctly in the migration edge case,
        // but we push a blank to keep the array lengths synchronized.
        newPublicIds.push("");
      }
    }

    if (needsUpdate) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: newImages,
          imagePublicIds: newPublicIds,
        },
      });
      migrated++;
      console.log(`Updated product: ${product.name}`);
    }
  }

  console.log(`Migrated ${migrated} products.`);
}

async function migrateHeroSlides() {
  console.log("Migrating hero slides...");
  const slides = await prisma.heroSlide.findMany();
  let migrated = 0;

  for (const slide of slides) {
    console.log(`Processing slide: ${slide.label}`);
    
    if (slide.image.startsWith("/products/")) {
      const filePath = path.join(process.cwd(), "public", slide.image.replace(/^\//, ""));
      try {
        await fs.access(filePath);
        console.log(`Uploading ${filePath}...`);
        const result = await uploadFileToCloudinary(filePath, "hero");

        if (result) {
          await prisma.heroSlide.update({
            where: { id: slide.id },
            data: {
              image: result.secure_url,
              imagePublicId: result.public_id,
            },
          });
          migrated++;
          console.log(`Updated slide: ${slide.label}`);
        }
      } catch (e) {
        console.warn(`File not found or access error for ${slide.image}:`, e);
      }
    }
  }

  console.log(`Migrated ${migrated} hero slides.`);
}

async function main() {
  console.log("Starting Cloudinary migration...");
  await migrateProducts();
  await migrateHeroSlides();
  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
