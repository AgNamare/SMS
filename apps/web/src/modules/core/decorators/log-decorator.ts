// src/modules/core/decorators/log-decorator.ts
import { LogService } from "../services/log-service";
import { LogAction } from "../repositories/log-repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/lib/auth-options";

export function Log(action: LogAction, module: string, description: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const logService = new LogService();
      const result = await method.apply(this, args);

      const session = await getServerSession(authOptions);
      const userId = session?.user?.id ? Number(session.user.id) : undefined;

      await logService.logUserAction(action, module, description, userId);

      return result;
    };

    return descriptor;
  };
}
