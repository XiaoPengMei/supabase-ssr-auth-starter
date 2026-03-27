import { defineConfig } from "@playwright/test";

const basePort = Number(process.env.PLAYWRIGHT_BASE_PORT ?? "4174");
const baseUrl = `http://127.0.0.1:${basePort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: baseUrl,
    headless: true
  },
  webServer: {
    command: `npm run start -- --port ${basePort}`,
    url: `${baseUrl}/sign-in`,
    reuseExistingServer: false
  }
});
