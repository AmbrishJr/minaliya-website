-- CreateTable
CREATE TABLE "HeaderSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeaderSettings_pkey" PRIMARY KEY ("id")
);
