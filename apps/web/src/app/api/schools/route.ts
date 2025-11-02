// src/app/api/school/route.ts
import { SchoolRoute } from "@/src/modules/school/routes/route";

const schoolRoute = new SchoolRoute();

export async function GET(req: Request) {
  return schoolRoute.handleGet(req);
}

export async function POST(req: Request) {
  return schoolRoute.handlePost(req);
}

export async function PUT(req: Request) {
  return schoolRoute.handleUpdate(req);
}
