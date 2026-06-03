import { test, expect } from "@playwright/test";

// npx playwright test tests/task2-core-ui.spec.ts

test("Login Flow (Form Handling)", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/account");
});

test("Invalid Login (Negative Testing)", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill("invalid@test.com");
  await page.locator('[data-test="password"]').fill("wrongpassword");
  await page.getByRole("button", { name: "Login" }).click();

  const errorMessage = page.locator('[data-test="login-error"]');

  await expect.soft(errorMessage).toBeVisible();
  await expect.soft(errorMessage).toContainText(/invalid|incorrect/i);
  await expect.soft(page).toHaveURL("/auth/login");
});

test("Product Search", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Search").fill("pliers");
  await page.getByRole("button", { name: "Search" }).click();

  // Verify search results
  await expect(page.getByTestId("search-result-count")).toContainText(/products found for 'pliers'/i);

  const matchingProducts = page.locator('[data-test="product-name"]').filter({ hasText: /pliers/i });
  await expect.soft(matchingProducts.first()).toBeVisible();
  const matchingCount = await matchingProducts.count();
  await expect.soft(matchingCount).toBeGreaterThan(0);
});
