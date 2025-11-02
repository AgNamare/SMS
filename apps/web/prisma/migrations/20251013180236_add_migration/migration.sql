/*
  Warnings:

  - You are about to drop the `branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."branch" DROP CONSTRAINT "branch_school_id_fkey";

-- DropTable
DROP TABLE "public"."branch";

-- DropTable
DROP TABLE "public"."school";

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_logo_url" TEXT,
    "school_motto" TEXT,
    "contact_email" TEXT,
    "contact_phone_number" TEXT,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_address" TEXT,
    "branch_email" TEXT,
    "branch_phone_number" TEXT,
    "opening_time" INTEGER,
    "closing_time" INTEGER,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
