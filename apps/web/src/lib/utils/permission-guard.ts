// src/modules/core/guards/permission-guard.ts
import "reflect-metadata";
import { getServerSession } from "next-auth";
import { PermissionService } from "@/src/modules/user/services/permission-service";
import { authOptions } from "@/src/app/lib/auth-options";

export async function checkPermission(target: any, methodName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized: No user session");

  const metadata = Reflect.getMetadata("permission", target, methodName);
  if (!metadata) return true;

  const { resource, action } = metadata;

  const permissionService = new PermissionService();
  const hasPermission = await permissionService.userHasPermission(
    session.user.id,
    resource,
    action
  );

  if (!hasPermission) {
    throw new Error(`Forbidden: Missing ${resource}:${action} permission`);
  }

  return true;
}
