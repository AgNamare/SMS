import type { CreateApplicationInput } from "@/src/app/lib/validations/admission-validation";
import { Permission } from "../../core/decorators/permission.decorator";
import { BaseService } from "../../core/services/base-service";
import { Log } from "../../core/decorators/log-decorator";
import { nowTimestamp } from "@/src/lib/utils/time";
import { ApplicationRepository } from "../repositories/application-repository";

export class ApplicationService extends BaseService<any, ApplicationRepository> {
  constructor() {
    super(new ApplicationRepository());
  }

  @Permission("application", "create")
  @Log("CREATE", "Application", "New Application Created")
  async createApplication(data: CreateApplicationInput) {
    const finalData = {
      ...data,
      created_at: nowTimestamp(),
      updated_at: nowTimestamp(),
    };
    const application = await super.create(finalData);
    return { application };
  }
}
