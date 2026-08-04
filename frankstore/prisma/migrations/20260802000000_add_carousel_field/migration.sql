-- AlterTable
ALTER TABLE "Product" ADD COLUMN "carousel" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN "carouselOrder" INTEGER NOT NULL DEFAULT 0;

-- Seed existing featured products into the carousel by default (newest first)
UPDATE "Product"
SET "carousel" = true,
    "carouselOrder" = sub.rn
FROM (
  SELECT id, row_number() OVER (ORDER BY "createdAt" DESC) AS rn
  FROM "Product"
  WHERE "featured" = true
) AS sub
WHERE "Product"."id" = sub.id;
