"use client";
import toast from "react-hot-toast";

// src/app/lib/client-services/permission-client-service.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class PermissionClientService {
  baseUrl = "/api/users/roles/permissions";

  private async handleApiResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    try {
      const json: ApiResponse<T> = await response.json();

      if (!response.ok || !json.success) {
        return {
          success: false,
          message: json.message || "Request failed",
        };
      }

      return {
        success: true,
        data: json.data,
        message: json.message,
      };
    } catch {
      return {
        success: false,
        message: "Failed to parse response",
      };
    }
  }

  async getPermissionsByModule(
    module: string,
    page = 1,
    limit = 50
  ): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(
        `${this.baseUrl}?search=${module}&page=${page}&limit=${limit}`
      );
      console.log("Fetching permissions for module:", module, res);
      return await this.handleApiResponse<any>(res);
    } catch (error) {
      console.error("Error fetching permissions by module:", error);
      toast.error("Network error while fetching permissions");
      return {
        success: false,
        message: "Network error while fetching permissions",
      };
    }
  }

  async getModules(): Promise<ApiResponse<any[]>> {
    try {
      const res = await fetch(`${this.baseUrl}/modules`);
      return await this.handleApiResponse<any[]>(res);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error("Network error while fetching modules");
      return {
        success: false,
        message: "Network error while fetching modules",
      };
    }
  }

  async assignPermissionsToRole(
    roleId: number,
    permissionIds: number[]
  ): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(`${this.baseUrl}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, permissionIds }),
      });
      return await this.handleApiResponse<any>(res);
    } catch (error) {
      console.error("Error assigning permissions to role:", error);
      toast.error("Network error while assigning permissions");
      return {
        success: false,
        message: "Network error while assigning permissions",
      };
    }
  }

  async getRoleWithPermissions(roleId: number): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(
        `${this.baseUrl}/role-permissions?roleId=${roleId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      return await this.handleApiResponse<any>(res);
    } catch (error) {
      console.error("Error getting role with permissions:", error);
      toast.error("Network error while fetching role permissions");
      return {
        success: false,
        message: "Network error while fetching role permissions",
      };
    }
  }

  async assignModulePermissionsToRole(
    roleId: number,
    module: string
  ): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, module }),
      });
      return await this.handleApiResponse<any>(res);
    } catch (error) {
      console.error("Error assigning module permissions:", error);
      toast.error("Network error while assigning module permissions");
      return {
        success: false,
        message: "Network error while assigning module permissions",
      };
    }
  }

  async removePermissionsFromRole(
    roleId: number,
    permissionIds: number[]
  ): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(`${this.baseUrl}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, permissionIds }),
      });
      return await this.handleApiResponse<any>(res);
    } catch (error) {
      console.error("Error removing permissions:", error);
      toast.error("Network error while removing permissions");
      return {
        success: false,
        message: "Network error while removing permissions",
      };
    }
  }
}
