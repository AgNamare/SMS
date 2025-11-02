import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "@/src/modules/core/repositories/base-repository";
import type { User, Role, Permission } from "@prisma/client";

type UserWithRolesAndPermissions = User & {
  roles: {
    role: Role & {
      permissions: Permission[];
    };
  }[];
};

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user);
  }

  async findWithRolesAndPermissions(userId: number) {
    return this.model.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    }) as Promise<UserWithRolesAndPermissions | null>;
  }
}
