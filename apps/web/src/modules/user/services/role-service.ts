import { Prisma } from "@prisma/client";
import { BaseService } from "../../core/services/base-service";
import { RoleRepository } from "../repositories/role-repository";
import { Permission } from "../../core/decorators/permission.decorator";

export class RoleService extends BaseService<any, RoleRepository> {
  constructor() {
    super(new RoleRepository());
  }

  async getPaginatedRoles(
    page: number = 1,
    limit: number = 10,
    search?: string,
    select?: Prisma.RoleSelect
  ) {
    let where: Prisma.RoleWhereInput = {};

    if (search) {
      where = {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      };
    }

    const defaultSelect: Prisma.RoleSelect = {
      name: true,
    };

    const finalSelect = select || defaultSelect;

    return this.listPaginated(page, limit, where, finalSelect);
  }

  @Permission("role", "create")
  async create(data: any) {
    return this.repository.create(data);
  }

  @Permission("role", "update")
  async update(id: number, data: any) {
    return this.repository.update(id, data);
  }

  @Permission("role", "delete")
  async delete(id: number) {
    return this.repository.delete(id);
  }

  @Permission("permission_assignment", "assign_individual_permissions_to_roles")
  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    return this.repository.assignPermissionsToRole(roleId, permissionIds);
  }

  @Permission(
    "permission_assignment",
    "assign_entire_module_permissions_to_roles"
  )
  async assignModulePermissionsToRole(roleId: number, module: string) {
    return this.repository.assignModulePermissionsToRole(roleId, module);
  }

  @Permission("permission_viewing", "view_assigned_permissions_for_roles")
  async getRoleWithPermissions(roleId: number) {
    return this.repository.getRoleWithPermissions(roleId);
  }

  @Permission("permission_management", "remove_permissions_from_roles")
  async removePermissionsFromRole(roleId: number, permissionIds: number[]) {
    return this.repository.removePermissionsFromRole(roleId, permissionIds);
  }
}
