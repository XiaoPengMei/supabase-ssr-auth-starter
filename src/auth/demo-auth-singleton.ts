import { createDemoAuthService, type DemoAuthService } from "./demo-auth";

declare global {
  var __demoAuthService: DemoAuthService | undefined;
}

export function getDemoAuthService() {
  if (!globalThis.__demoAuthService) {
    globalThis.__demoAuthService = createDemoAuthService();
  }

  return globalThis.__demoAuthService;
}
