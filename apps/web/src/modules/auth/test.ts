import "reflect-metadata";

function Permission(module: string, action: string) {
  return Reflect.metadata("permission", { module, action });
}

export class TestService {
  @Permission("auth", "test-action")
  test() {
    console.log("Testing...");
  }
}
