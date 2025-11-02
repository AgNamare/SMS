import { RoleRoute } from "@/src/modules/user/routes/role-route";

const roleRoute = new RoleRoute();

export async function GET(req: Request) {
  return roleRoute.handleGet(req);
}
