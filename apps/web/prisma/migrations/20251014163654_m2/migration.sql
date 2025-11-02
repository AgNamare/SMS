/*
  Warnings:

  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropTable
DROP TABLE "public"."RolePermission";

-- CreateTable
CREATE TABLE "_RoleToPermissions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RoleToPermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoleToPermissions_B_index" ON "_RoleToPermissions"("B");

-- AddForeignKey
ALTER TABLE "_RoleToPermissions" ADD CONSTRAINT "_RoleToPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToPermissions" ADD CONSTRAINT "_RoleToPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
