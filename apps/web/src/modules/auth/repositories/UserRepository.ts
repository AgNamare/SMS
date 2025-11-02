import { prisma } from "@/src/app/lib/prisma";
import { User } from "@prisma/client";
import { Permission } from "@/src/modules/core/decorators/permission.decorator";

export class UserRepository {
  @Permission("students", "find")
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }
}
