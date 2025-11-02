// src/modules/core/services/log-service.ts
import { BaseService } from "@/src/modules/core/services/base-service";
import { nowTimestamp } from "@/src/lib/utils/time";
import { LogAction, LogRepository } from "../repositories/log-repository";

export class LogService extends BaseService<any, LogRepository> {
  constructor() {
    super(new LogRepository());
  }

  async logUserAction(
    action: LogAction,
    module: string,
    description: string,
    userId?: number
  ) {
    return this.create({
      action,
      module,
      description,
      user_id: userId,
      createdAt: nowTimestamp(),
    });
  }

  async getUserLogs(userId: number, page: number = 1, limit: number = 10) {
    return this.listPaginated(
      page,
      limit,
      { user_id: userId },
      {
        id: true,
        action: true,
        module: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            first_name: true,
            last_name:true,
            email: true,
          },
        },
      }
    );
  }

  async getModuleLogs(module: string, page: number = 1, limit: number = 10) {
    return this.listPaginated(
      page,
      limit,
      { module },
      {
        id: true,
        action: true,
        module: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      }
    );
  }

  async getSystemLogs(page: number = 1, limit: number = 10) {
    return this.listPaginated(
      page,
      limit,
      {},
      {
        id: true,
        action: true,
        module: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      }
    );
  }

  async getRecentActivity(limit: number = 50) {
    return this.repository.list({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
