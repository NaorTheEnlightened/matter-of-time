/*
  Warnings:

  - You are about to drop the column `probability` on the `Desire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Desire" DROP COLUMN "probability";

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "desireId" INTEGER NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtomPlacement" (
    "id" SERIAL NOT NULL,
    "beginning" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "AtomPlacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Force" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "atomPlacementId" INTEGER NOT NULL,

    CONSTRAINT "Force_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hypothesis" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "isSuccessful" BOOLEAN NOT NULL DEFAULT false,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "Hypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hypothesis_toolId_key" ON "Hypothesis"("toolId");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtomPlacement" ADD CONSTRAINT "AtomPlacement_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Force" ADD CONSTRAINT "Force_atomPlacementId_fkey" FOREIGN KEY ("atomPlacementId") REFERENCES "AtomPlacement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
