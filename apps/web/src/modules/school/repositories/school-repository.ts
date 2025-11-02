// src/modules/core/repositories/school.repository.ts
import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "@/src/modules/core/repositories/base-repository";

export class SchoolRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.school);
  }

  async getSchool() {
    const schools = await this.list({
      take: 1,
      include: {
        primary_contact: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_photo: true,
          },
        },
        branches: {
          include: {
            branch_manager: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                profile_photo: true,
              },
            },
          },
          orderBy: { branch_name: "asc" },
        },
      },
    });

    return schools[0] || null;
  }
  
}
