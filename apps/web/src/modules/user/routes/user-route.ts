import type { CreateUserInput } from "@/src/app/lib/validations/user-schema";
import { BaseRoute } from "../../core/routes/base-route";
import { UserService } from "../services/user-service";
import { handleResponseError } from "@/src/lib/utils/api-error-response";

export class UserRoute extends BaseRoute<UserService> {
  constructor() {
    super(new UserService());
  }

  async handlePost(req: Request) {
    try {
      const body: CreateUserInput = await req.json();
      const user = await this.service.createUser(body);
      return this.jsonResponse(user, 201);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async handleGet(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get("page") || 1);
      const limit = Number(searchParams.get("limit") || 10);
      const search = searchParams.get("search") || undefined;

      const result = await this.execute(
        "getPaginatedUsers",
        page,
        limit,
        search
      );

      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }

  async serverGetPaginatedUsers(page = 1, limit = 10, search?: string) {
    try {
      const result = await this.execute(
        "getPaginatedUsers",
        page,
        limit,
        search
      );
      return result;
    } catch (error) {
      throw error; // let the SSR component handle
    }
  }
}
