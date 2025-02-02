/*
  Warnings:

  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactNumber" VARCHAR(20),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" VARCHAR(100),
ADD COLUMN     "storeLogo" VARCHAR(255);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" VARCHAR(50) NOT NULL,
ADD COLUMN     "image" VARCHAR(255),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;
