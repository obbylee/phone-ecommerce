/*
  Warnings:

  - Made the column `stockQuantity` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minimumOrderQuantity` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "stockQuantity" SET NOT NULL,
ALTER COLUMN "minimumOrderQuantity" SET NOT NULL;
