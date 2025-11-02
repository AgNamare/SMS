// src/lib/auth-guard.ts
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

/**
 * Ensures the user is logged in and (optionally) has a required role/permission.
 */
export async function requireAuth(requiredRoles?: string[]) {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session || !session.user) {
    redirect("/login"); // 🚫 Not logged in
  }

  // ✅ Optional: Role check
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = session.user.roles?.map((r: any) => r.name) || [];
    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      redirect("/unauthorized"); // 🚫 Lacks permission
    }
  }

  return session;
}
