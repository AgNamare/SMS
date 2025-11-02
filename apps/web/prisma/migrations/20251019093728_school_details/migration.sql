/*
  Warnings:

  - You are about to drop the column `contact_email` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `contact_phone_number` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `school_logo_url` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `school_motto` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `school_name` on the `School` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branch_code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_name` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legal_name` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "branch_code" TEXT,
ADD COLUMN     "branch_manager_id" INTEGER,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "opening_time" SET DATA TYPE TEXT,
ALTER COLUMN "closing_time" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "contact_email",
DROP COLUMN "contact_phone_number",
DROP COLUMN "school_logo_url",
DROP COLUMN "school_motto",
DROP COLUMN "school_name",
ADD COLUMN     "address_line1" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "established_date" TIMESTAMP(3),
ADD COLUMN     "legal_name" TEXT NOT NULL,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "motto" TEXT,
ADD COLUMN     "phone_main" TEXT,
ADD COLUMN     "primary_contact_id" INTEGER,
ADD COLUMN     "registration_number" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branch_code_key" ON "Branch"("branch_code");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_primary_contact_id_fkey" FOREIGN KEY ("primary_contact_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_branch_manager_id_fkey" FOREIGN KEY ("branch_manager_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
