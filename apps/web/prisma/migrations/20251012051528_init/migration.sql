/*
  Warnings:

  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `action` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `Permission` table. All the data in the column will be lost.
  - The `id` column on the `Permission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_roleId_fkey";

-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "action",
DROP COLUMN "roleId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "module" DROP NOT NULL,
ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
