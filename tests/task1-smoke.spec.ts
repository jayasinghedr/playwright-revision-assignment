import { test, expect } from "@playwright/test";

test("Home Page Loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Practice Software Testing/);
  await expect(page).toHaveURL("/");

  // TODO: Verify the site logo/header is visible
  // await expect(page.getByRole("heading", { name: "TOOL SHOP" })).toBeVisible();
});

test("Navigation Links Work", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Categories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL("/contact");
});
