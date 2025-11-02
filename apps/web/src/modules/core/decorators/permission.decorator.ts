// src/modules/core/permission.decorator.ts
import "reflect-metadata";

export function Permission(module: string, action: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      "permission",
      { module, action },
      target,
      propertyKey
    );
  };
}
