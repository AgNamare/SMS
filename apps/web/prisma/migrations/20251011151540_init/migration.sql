/*
  Warnings:

  - Added the required column `users` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "users" TEXT NOT NULL;
