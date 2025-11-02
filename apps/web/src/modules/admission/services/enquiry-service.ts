import { nowTimestamp } from "@/src/lib/utils/time";
import { Log } from "../../core/decorators/log-decorator";
import { Permission } from "../../core/decorators/permission.decorator";
import { BaseService } from "../../core/services/base-service";
import { EnquiryRepository } from "../repositories/enquiry-repository";
import type { CreateEnquiryInput } from "@/src/app/lib/validations/admission-validation";

export class EnquiryService extends BaseService<any, EnquiryRepository> {
  constructor() {
    super(new EnquiryRepository());
  }

  @Permission("enquiry", "create")
  @Log("CREATE", "Enquiry", "New Enquiry Created")
  async createEnquiry(data: CreateEnquiryInput) {
    const finalData = {
      ...data,
      created_at: nowTimestamp(),
      updated_at: nowTimestamp(),
    };
    const enquiry = await super.create(finalData);
    return { enquiry };
  }
}
