/*
  Warnings:

  - You are about to drop the column `created_At` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "created_At",
DROP COLUMN "updated_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
