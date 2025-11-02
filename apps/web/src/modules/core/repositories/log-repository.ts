// src/modules/core/repositories/log-repository.ts
import { prisma } from "@/src/app/lib/prisma";
import { BaseRepository } from "@/src/modules/core/repositories/base-repository";

export type LogAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "PERMISSION_UPDATE"
  | "ROLE_ASSIGN";

export interface CreateLogInput {
  action: LogAction;
  module: string;
  description: string;
  user_id?: number;
  createdAt: number;
}

export class LogRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.log);
  }
}
