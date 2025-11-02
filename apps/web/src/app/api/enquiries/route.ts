import { EnquiryRoute } from "@/src/modules/admission/routes/enquiry-route";

const enquiryRoute = new EnquiryRoute()
export async function POST(req: Request) {
  return enquiryRoute.handlePost(req);
}
