-- AlterTable
ALTER TABLE "Order" ADD COLUMN "priceDetails" JSONB,
ADD COLUMN "adminNotified" BOOLEAN NOT NULL DEFAULT false;
