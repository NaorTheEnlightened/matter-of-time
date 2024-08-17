/*
  Warnings:

  - You are about to drop the column `startDate` on the `Event` table. All the data in the column will be lost.
  - Added the required column `order` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "startDate",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDescription" TEXT,
ADD COLUMN     "endImage" TEXT,
ADD COLUMN     "startDescription" TEXT,
ADD COLUMN     "startImage" TEXT;

-- AlterTable
ALTER TABLE "MiniEvent" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER NOT NULL;
