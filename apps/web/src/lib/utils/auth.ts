// src/lib/auth-utils.ts
import { cache } from "react";
import { getServerSession } from "next-auth";
import { UserService } from "@/src/modules/user/services/user-service";
import { authOptions } from "@/src/app/lib/auth-options";

export const getCurrentUserWithPermissions = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const userService = new UserService();
  return await userService.getUserWithPermissions(session.user.id);
});