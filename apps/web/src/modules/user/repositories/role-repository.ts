import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "../../core/repositories/base-repository";

export class RoleRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.role);
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    // First verify role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    // Connect permissions to role (Prisma handles many-to-many)
    return await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  async assignModulePermissionsToRole(roleId: number, module: string) {
    // Get all permissions for the module
    const modulePermissions = await this.prisma.permission.findMany({
      where: { module },
    });

    if (modulePermissions.length === 0) {
      throw new Error(`No permissions found for module: ${module}`);
    }

    const permissionIds = modulePermissions.map((p) => p.id);

    return await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: {
          where: { module },
        },
      },
    });
  }

  async getRoleWithPermissions(roleId: number) {
    return await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async removePermissionsFromRole(roleId: number, permissionIds: number[]) {
    return await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          disconnect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
  }
}
