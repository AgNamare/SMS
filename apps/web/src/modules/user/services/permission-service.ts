import { Prisma } from "@prisma/client";
import { BaseService } from "../../core/services/base-service";
import { PermissionRepository } from "../repositories/permission-repository";
import { capitalize } from "@/src/lib/utils/capitalize";

export class PermissionService extends BaseService<any, PermissionRepository> {
  constructor() {
    super(new PermissionRepository());
  }

  async getPaginatedRoles(
    page: number = 1,
    limit: number = 10,
    search?: string,
    select?: Prisma.PermissionSelect
  ) {
    let where: Prisma.PermissionWhereInput = {};

    if (search) {
      where = {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      };
    }

    const defaultSelect: Prisma.PermissionSelect = {
      name: true,
      description: true,
      module: true,
      id: true,
    };

    const finalSelect = select || defaultSelect;

    return this.listPaginated(page, limit, where, finalSelect);
  }

  /**
   * Check if a user has permission to perform an action on a module
   * Example: userHasPermission("user-id", "school", "update")
   */
  async userHasPermission(
    userId: number,
    module: string,
    action: string
  ): Promise<boolean> {
    const permissionName = `${module}:${action}`;
    return this.repository.userHasPermission(userId, permissionName);
  }

  async getPermissionsByModule(
    module?: string,
    page: number = 1,
    limit: number = 50
  ) {
    return this.repository.getPermissionsByModule(module, page, limit);
  }

  async getModules() {
    return this.repository.getModules();
  }
}
