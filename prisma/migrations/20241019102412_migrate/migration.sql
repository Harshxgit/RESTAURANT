-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "addressid" INTEGER NOT NULL,
    "pincode" INTEGER NOT NULL,
    "streetRoad" TEXT NOT NULL,
    "colony" TEXT NOT NULL,
    "area" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_addressid_fkey" FOREIGN KEY ("addressid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
