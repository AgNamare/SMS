import { RoleRoute } from "@/src/modules/user/routes/role-route";

const roleRoute = new RoleRoute();

export async function POST(req: Request) {
  return roleRoute.handleAssignPermissions(req);
}
