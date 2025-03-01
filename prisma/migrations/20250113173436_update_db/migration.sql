/*
  Warnings:

  - You are about to drop the column `orderId` on the `Reservation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservationid]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `partysize` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_orderId_fkey";

-- DropIndex
DROP INDEX "Reservation_orderId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "reservationid" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "orderId",
DROP COLUMN "partysize",
ADD COLUMN     "partysize" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_reservationid_key" ON "Order"("reservationid");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_reservationid_fkey" FOREIGN KEY ("reservationid") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
