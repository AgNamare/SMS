import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "@/src/modules/core/repositories/base-repository";

export class BranchRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.branch);
  }

  async findManyBySchool(school_id: string) {
    return this.list({ where: { school_id } });
  }
}
