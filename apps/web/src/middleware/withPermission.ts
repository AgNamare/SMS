import { getServerSession } from "next-auth";
import { authOptions } from "../app/lib/auth-options";

/**
 * Middleware to protect API route handlers by checking user permissions.
 *
 * This function wraps a given route handler and enforces that:
 *   1. The user is authenticated (has a valid session).
 *   2. The user has the required permission, unless they are SUPER_ADMIN.
 *
 * If the user is not authenticated, it returns a 401 Unauthorized response.
 * If the user lacks the required permission, it returns a 403 Forbidden response.
 *
 * @param requiredPermission - The name of the permission required to access the route (e.g., "User:create").
 * @param handler - The actual route handler function to execute if authorization passes.
 * @returns A wrapped async function that performs the permission check before calling the handler.
 *
 * @example
 * export const GET = withPermission("User:create", async (req) => {
 *   // your logic here
 *   return new Response(JSON.stringify({ success: true }));
 * });
 */

export function withPermission(requiredPermission: string, handler: Function) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);

    // 🔒 If no session, block request
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - no session" }),
        { status: 401 }
      );
    }

    const user = session.user;

    // 🦸 If user has SUPER_ADMIN role, bypass all checks
    const isSuperAdmin = user.roles.some((r: any) => r.name === "SUPER_ADMIN");

    if (isSuperAdmin) {
      return handler(req);
    }

    // 🧠 Otherwise, check for the specific permission
    const hasPermission = user.roles.some((role: any) =>
      role.permissions.includes(requiredPermission)
    );

    if (!hasPermission) {
      return new Response(
        JSON.stringify({ error: "Forbidden - insufficient permissions" }),
        { status: 403 }
      );
    }

    // ✅ Proceed if authorized
    return handler(req);
  };
}
