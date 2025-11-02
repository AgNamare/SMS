import { UserRoute } from "@/src/modules/user/routes/user-route";

const userRoute = new UserRoute();

export async function POST(req: Request) {
  return userRoute.handlePost(req);
}

export async function GET(req: Request) {
  return userRoute.handleGet(req);
}
