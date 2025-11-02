import { handleResponseError } from "@/src/lib/utils/api-error-response";
import { BaseRoute } from "../../core/routes/base-route";
import { PermissionService } from "../services/permission-service";

export class PermissionRoute extends BaseRoute<PermissionService> {
  constructor() {
    super(new PermissionService());
  }

  async handleGet(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get("page") || 1);
      const limit = Number(searchParams.get("limit") || 10);
      const search = searchParams.get("search") || undefined;

      const result = await this.service.getPaginatedRoles(page, limit, search);

      return this.jsonResponse(result, 200);
    } catch (error) {
      console.log(handleResponseError(error));
      return handleResponseError(error);
    }
  }
}
