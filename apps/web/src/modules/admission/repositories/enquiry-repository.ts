import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "../../core/repositories/base-repository";

export class EnquiryRepository extends BaseRepository<any>{
    constructor() {
        super(prisma.enquiry);
    }
}