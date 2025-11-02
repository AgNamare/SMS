// src/modules/core/routes/base-route.ts
import { AppError } from "@/src/lib/utils/app-error";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import "reflect-metadata";
import { PermissionService } from "@/src/modules/user/services/permission-service";
import { authOptions } from "@/src/app/lib/auth-options";

/**
 * BaseRoute provides standardized request handling for API endpoints.
 * It handles:
 *  - Consistent JSON success/error responses
 *  - Centralized permission enforcement
 *  - Safe service method execution
 *  - SUPER_ADMIN role override
 */
export abstract class BaseRoute<TService extends object> {
  protected service: TService;

  constructor(service: TService) {
    this.service = service;
  }

  /**
   * Executes a service method after checking permission (if required).
   */
  protected async execute(
    methodName: keyof TService,
    ...args: any[]
  ): Promise<any> {
    await this.checkPermission(methodName as string);

    const method = (this.service as any)[methodName];
    if (typeof method !== "function") {
      throw new AppError(
        `Service method '${String(methodName)}' not found.`,
        "The requested operation is not available.",
        500
      );
    }

    try {
      return await method.apply(this.service, args);
    } catch (err: any) {
      throw err instanceof AppError
        ? err
        : new AppError(
            err.message || "An unexpected error occurred.",
            "Something went wrong while processing your request.",
            500
          );
    }
  }

  /**
   * Permission enforcement logic for decorated methods.
   * @Permission("module", "action")
   * Automatically bypassed for SUPER_ADMIN users.
   */
  private async checkPermission(methodName: string) {
    console.log("🔍 checkPermission start:", methodName);

    // ✅ Fetch metadata from the actual service class prototype
    const metadata = Reflect.getMetadata(
      "permission",
      Object.getPrototypeOf(this.service),
      methodName
    );

    console.log("📎 Metadata found:", metadata);

    if (!metadata) {
      console.log("ℹ️ No permission metadata found — skipping check.");
      return;
    }

    const { module, action } = metadata;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(
        "Unauthorized: No active session.",
        "You must be logged in to perform this action.",
        401
      );
    }

    const roles = Array.isArray(session.user.roles) ? session.user.roles : [];
    const isSuperAdmin = roles.some((r) => r.name === "SUPER_ADMIN");

    if (isSuperAdmin) return;

    const permissionService = new PermissionService();
    const hasPermission = await permissionService.userHasPermission(
      Number(session.user.id),
      module,
      action
    );

    console.log("🔑 Has permission:", hasPermission);

    if (!hasPermission) {
      throw new AppError(
        `Forbidden: Missing ${module}:${action} permission.`,
        "You don’t have permission to perform this action.",
        403
      );
    }

    console.log("✅ Permission check passed!");
  }

  /**
   * Standardized success JSON response.
   */
  protected jsonResponse<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
  }

  /**
   * Standardized error JSON response.
   */
  protected errorResponse(error: any, status = 500) {
    console.error("❌ Route Error:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.userMessage || "Something went wrong.",
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status }
    );
  }
}
