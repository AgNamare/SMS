import { CreateApplicationInput } from "@/src/app/lib/validations/admission-validation";
import { BaseRoute } from "../../core/routes/base-route";
import { ApplicationService } from "../services/application-service";
import { handleResponseError } from "@/src/lib/utils/api-error-response";

export class ApplicationRoute extends BaseRoute<ApplicationService>{
    constructor() {
        super(new ApplicationService())
    }

    async handleGet(req: Request) {
        try {
            const body: CreateApplicationInput = await req.json();
            const application = await this.service.createApplication(body);
            return this.jsonResponse(application, 201)
        } catch (error) {
            return handleResponseError(error)
        }
    }
}