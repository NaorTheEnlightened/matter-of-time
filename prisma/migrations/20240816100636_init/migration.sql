/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MiniEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "MiniEvent" DROP CONSTRAINT "MiniEvent_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_eventId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "MiniEvent";

-- DropTable
DROP TABLE "Section";

-- CreateTable
CREATE TABLE "Desire" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "timeDays" INTEGER NOT NULL,
    "timeHours" INTEGER NOT NULL,
    "timeMinutes" INTEGER NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Desire_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Desire" ADD CONSTRAINT "Desire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
