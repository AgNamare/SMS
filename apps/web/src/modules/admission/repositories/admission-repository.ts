import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "../../core/repositories/base-repository";
import { Prisma } from "@prisma/client";

export class AdmissionRepository extends BaseRepository<Prisma.AdmissionDelegate<any>>{
    constructor() {
        super(prisma.admission)
    }
}