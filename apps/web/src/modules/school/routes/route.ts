// src/modules/school/routes/school-route.ts
import { BaseRoute } from "../../core/routes/base-route";
import { SchoolService } from "../services/school-service";

export class SchoolRoute extends BaseRoute<SchoolService> {
  constructor() {
    super(new SchoolService());
  }

  async handleGet(req: Request) {
    try {
      const school = await this.execute('getSchool');
      return this.jsonResponse(school, 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async handlePost(req: Request) {
    try {
      const body = await req.json();
      const school = await this.execute('upsertSchool');
      return this.jsonResponse(school, 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }
  async handleUpdate(req: Request) {
    try {
      const body = await req.json();
      const school = await this.service.upsertSchool(body);
      return this.jsonResponse(school, 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }
}
