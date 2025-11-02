import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { UserService } from "@/src/modules/user/services/user-service";
import { authOptions } from "../lib/auth-options";

interface CanProps {
  permission?: string;
  role?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface UserWithPermissions {
  id: Number;
  firstName: string;
  lastName: string;
  email: string;
  roles: {
    name: string;
    permissions: string[];
  }[];
}

export const dynamic = "force-dynamic";

export async function Can({
  permission,
  role,
  children,
  fallback = null,
}: CanProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <>{fallback}</>;

  const userService = new UserService();
  const user: UserWithPermissions | null =
    await userService.getUserWithPermissions(session.user.id);
  if (!user) return <>{fallback}</>;

  const roleNames = user.roles.map((r) => r.name);
  const allPermissions = user.roles.flatMap((r) => r.permissions);

  const hasPermission = permission
    ? allPermissions.includes(permission)
    : false;
  const hasRole = role ? roleNames.includes(role) : false;
  const isSuperAdmin = roleNames.includes("SUPER_ADMIN");

  if (hasPermission || hasRole || isSuperAdmin) return <>{children}</>;
  return <>{fallback}</>;
}
