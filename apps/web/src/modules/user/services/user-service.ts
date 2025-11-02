// src/modules/core/services/user.service.ts
import { BaseService } from "@/src/modules/core/services/base-service";
import { UserRepository } from "../repositories/user-repository";
import { createUserSchema as userSchema } from "@/src/app/lib/validations/user-schema";
import { nowTimestamp } from "@/src/lib/utils/time";
import bcrypt from "bcryptjs";
import { Permission } from "../../core/decorators/permission.decorator";
import { Log } from "../../core/decorators/log-decorator";
import { Prisma } from "@prisma/client";

const SALT_ROUNDS = 10;
const PEPPER = process.env.PASSWORD_PEPPER || "";

export class UserService extends BaseService<any, UserRepository> {
  constructor() {
    super(new UserRepository());
  }

  /**
   * Get user with roles and permissions in a simplified structure
   */
  @Permission("user", "read")
  async getUserWithPermissions(id: string) {
    const userId = parseInt(id);
    const user = await this.repository.findWithRolesAndPermissions(userId);

    if (!user) return null;

    const roles = user.roles.map((ur) => ({
      name: ur.role.name,
      permissions: ur.role.permissions.map((p) => p.name),
    }));

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profilePhoto: user.profile_photo,
      roles,
    };
  }

  /**
   * Create a new user
   */
  @Permission("user", "create")
  @Log("CREATE", "User", "New user created")
  async createUser(data: userSchema.CreateUserInput) {
    const hashedPassword = await bcrypt.hash(
      data.password + PEPPER,
      SALT_ROUNDS
    );

    const user = await super.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: hashedPassword,
      profile_photo: data.profilePhoto || null,
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp(),
    });

    return { user };
  }

  async getUsersForSelection() {
    const users = await super.getAll();
    return users.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profilePhoto: user.profile_photo,
      fullName: `${user.first_name} ${user.last_name}`,
    }));
  }

  @Permission("user", "HEllo")
  async getPaginatedUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    select?: Prisma.UserSelect
  ) {
    let where: Prisma.UserWhereInput = {};

    if (search) {
      where = {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const defaultSelect: Prisma.UserSelect = {
      first_name: true,
      last_name: true,
      profile_photo: true,
      email: true,
    };

    const finalSelect = select || defaultSelect;

    return super.listPagixnated(page, limit, where, finalSelect);
  }
}
