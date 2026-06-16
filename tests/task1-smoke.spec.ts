import { test, expect } from "@playwright/test";

test("1.1 Home Page Loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Practice Software Testing/);
  await expect(page).toHaveURL("/");

  // Verify the site logo/header is visible
  const titleBarLogo = page.locator('.navbar-brand');
  await expect(titleBarLogo).toBeVisible();
});

test("1.2 Navigation Links Work", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Categories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL("/contact");
});

test("1.3 Products Are Displayed", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[data-test="product-01KT3WDQC3D0J228YJ7EZDK564"]')).toBeVisible();
  await expect(page.locator('[data-test="product-01KT3WDQC3D0J228YJ7EZDK564"] [data-test="product-name"]')).toContainText("Combination Pliers");
  await expect(page.locator('[data-test="product-01KT3WDQC3D0J228YJ7EZDK564"] [data-test="product-price"]')).toContainText("$14.15");
});

test("1.4 Login Page Accessible", async ({ page }) => {
  await page.goto("/");

  // Verify the "Sign In" link is visible and click
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
  await page.getByRole("link", { name: "Sign In" }).click();

  // Navigate to the login page
  await expect(page).toHaveURL("/auth/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});
