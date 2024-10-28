/*
  Warnings:

  - Changed the type of `partysize` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "partysize",
ADD COLUMN     "partysize" INTEGER NOT NULL;