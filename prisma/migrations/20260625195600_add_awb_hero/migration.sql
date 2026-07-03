-- AlterTable
ALTER TABLE "Order" ADD COLUMN "awbNumber" TEXT;

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "headline" JSONB NOT NULL,
    "subtitle" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL DEFAULT '#C47700',
    "badge" TEXT,
    "bgPrimary" TEXT NOT NULL DEFAULT '#FFFFFF',
    "bgSecondary" TEXT NOT NULL DEFAULT '#F9F9F9',
    "bgAccent" TEXT NOT NULL DEFAULT '#FFFFFF',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);
