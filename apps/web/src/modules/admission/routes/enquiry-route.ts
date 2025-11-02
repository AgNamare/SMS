import { CreateEnquiryInput } from "@/src/app/lib/validations/admission-validation";
import { BaseRoute } from "../../core/routes/base-route";
import { EnquiryService } from "../services/enquiry-service";
import { handleResponseError } from "@/src/lib/utils/api-error-response";

export class EnquiryRoute extends BaseRoute<EnquiryService> {
  constructor() {
    super(new EnquiryService());
  }

  async handlePost(req: Request) {
    try {
      const body: CreateEnquiryInput = await req.json();
      console.log(body);
      const enquiry = await this.service.createEnquiry(body);
      return this.jsonResponse(enquiry, 201);
    } catch (error) {
      console.log(error);
      return handleResponseError(error);
    }
  }
}
