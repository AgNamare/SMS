import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "../../core/repositories/base-repository";

export class ApplicationRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.application);
  }
}
