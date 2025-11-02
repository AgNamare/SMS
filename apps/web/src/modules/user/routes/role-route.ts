// routes/role-route.ts
import { handleResponseError } from "@/src/lib/utils/api-error-response";
import { BaseRoute } from "../../core/routes/base-route";
import { RoleService } from "../services/role-service";

export class RoleRoute extends BaseRoute<RoleService> {
  constructor() {
    super(new RoleService());
  }

  async handleGet(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get("page") || 1);
      const limit = Number(searchParams.get("limit") || 10);
      const search = searchParams.get("search") || undefined;

      const result = await this.execute(
        "getPaginatedRoles",
        page,
        limit,
        search
      );
      console.log("Paginated roles: ")
      console.log(result);

      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handlePost(req: Request) {
    try {
      const body = await req.json();

      // Create role first if needed
      const result = await this.execute("create", body);
      return this.jsonResponse(result, 201);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handlePut(req: Request) {
    try {
      const body = await req.json();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return this.jsonResponse({ error: "Role ID is required" }, 400);
      }

      const result = await this.execute("update", parseInt(id), body);
      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handleDelete(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return this.jsonResponse({ error: "Role ID is required" }, 400);
      }

      const result = await this.execute("delete", parseInt(id));
      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handleAssignPermissions(req: Request) {
    try {
      const body = await req.json();
      const { roleId, permissionIds, module } = body;

      if (!roleId) {
        return this.jsonResponse({ error: "Role ID is required" }, 400);
      }

      let result;

      // If assigning by module
      if (module) {
        result = await this.execute(
          "assignModulePermissionsToRole",
          roleId,
          module
        );
      }
      // If assigning specific permissions
      else if (permissionIds && Array.isArray(permissionIds)) {
        result = await this.execute(
          "assignPermissionsToRole",
          roleId,
          permissionIds
        );
      } else {
        return this.jsonResponse(
          { error: "Either permissionIds or module is required" },
          400
        );
      }

      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handleGetRolePermissions(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const roleId = searchParams.get("roleId");

      if (!roleId) {
        return this.jsonResponse({ error: "Role ID is required" }, 400);
      }

      const result = await this.execute(
        "getRoleWithPermissions",
        parseInt(roleId)
      );

      if (!result) {
        return this.jsonResponse({ error: "Role not found" }, 404);
      }

      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handleRemovePermissions(req: Request) {
    try {
      const body = await req.json();
      const { roleId, permissionIds } = body;

      if (!roleId || !permissionIds || !Array.isArray(permissionIds)) {
        return this.jsonResponse(
          {
            error: "Role ID and permissionIds array are required",
          },
          400
        );
      }

      const result = await this.execute(
        "removePermissionsFromRole",
        roleId,
        permissionIds
      );

      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async serverGetPaginatedRoles(page = 1, limit = 10, search?: string) {
    try {
      const result = await this.execute(
        "getPaginatedRoles",
        page,
        limit,
        search
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async serverGetRoleWithPermissions(roleId: number) {
    try {
      const result = await this.execute("getRoleWithPermissions", roleId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
