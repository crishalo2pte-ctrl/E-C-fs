-- AlterTable
ALTER TABLE "Order" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'ARS';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'ARS';
