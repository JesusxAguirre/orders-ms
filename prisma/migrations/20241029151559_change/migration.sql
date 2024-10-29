/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalItems` on the `Order` table. All the data in the column will be lost.
  - Added the required column `total_amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_items` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount",
DROP COLUMN "totalItems",
ADD COLUMN     "total_amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "total_items" INTEGER NOT NULL;
