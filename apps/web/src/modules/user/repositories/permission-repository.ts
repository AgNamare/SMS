import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "../../core/repositories/base-repository";

export class PermissionRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.permission);
  }

  async userHasPermission(
    userId: number,
    permissionName: string
  ): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        roles: {
          some: {
            role: {
              permissions: {
                some: {
                  name: permissionName,
                },
              },
            },
          },
        },
      },
      select: { id: true },
    });

    return !!user;
  }

  async getPermissionsByModule(
    module?: string,
    page: number = 1,
    limit: number = 50
  ) {
    const skip = (page - 1) * limit;

    let where: any = {};
    if (module) {
      where.module = module;
    }

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { module: "asc" },
      }),
      this.prisma.permission.count({ where }),
    ]);

    return {
      data: permissions,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getModules() {
    return this.prisma.permission.findMany({
      distinct: ["module"],
      select: {
        module: true,
      },
      where: {
        module: {
          not: null,
        },
      },
    });
  }
}
