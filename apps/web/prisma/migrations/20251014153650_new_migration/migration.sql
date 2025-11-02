/*
  Warnings:

  - Added the required column `createdAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" INTEGER NOT NULL;
