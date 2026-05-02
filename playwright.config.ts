import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  reporter: "html",
  use: {
    baseURL: "https://practicesoftwaretesting.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
