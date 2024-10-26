/*
  Warnings:

  - You are about to drop the column `menuitemId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Table` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tablenumber]` on the table `Table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderid` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partysize` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tablenumber` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'ARCHIVED';

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuitemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropIndex
DROP INDEX "Table_number_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "total" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "menuitemId",
DROP COLUMN "orderId",
ADD COLUMN     "menuitem" JSONB[],
ADD COLUMN     "orderid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "partysize" TEXT NOT NULL,
ALTER COLUMN "time" SET DATA TYPE TEXT,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "number",
ADD COLUMN     "tablenumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_name_key" ON "MenuItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Table_tablenumber_key" ON "Table"("tablenumber");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
