import { PermissionRoute } from "@/src/modules/user/routes/permission-route";

const permissionRoute = new PermissionRoute();

export async function GET(req: Request) {
  const start = Date.now();
  const response = permissionRoute.handleGet(req);
  const duration = Date.now() - start;
  console.log(`⏱️ Permission query took ${duration}ms`);
  return response;
}

// export async function GET(req: Request) {
//   return roleRoute.handleGetRolePermissions(req);
// }

// export async function DELETE(req: Request) {
//   return roleRoute.handleRemovePermissions(req);
// }
