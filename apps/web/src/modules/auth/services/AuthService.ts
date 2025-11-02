import { nowTimestamp } from "@/src/lib/utils/time";
import { BaseRoute } from "@/src/modules/core/routes/base-route";
import { SchoolService } from "@/src/modules/school/services/school-service";

export class SchoolRoute extends BaseRoute<SchoolService> {
  constructor() {
    super(new SchoolService());
  }

  async handleGet(req: Request) {
    try {
      const url = new URL(req.url);
      const data = await this.service.getAll();
      return this.jsonResponse(data);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async handlePost(req: Request) {
    try {
      const body = await req.json();
      const school = await this.service.create({
        ...body,
        created_at: nowTimestamp(),
        updated_at: nowTimestamp(),
      });
      return this.jsonResponse(school, 201);
    } catch (error) {
      return this.errorResponse(error);
    }
  }
}
