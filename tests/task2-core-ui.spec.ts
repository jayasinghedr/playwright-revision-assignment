import { test, expect } from "@playwright/test";

// npx playwright test tests/task2-core-ui.spec.ts

test("2.1 Login Flow (Form Handling)", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/account");
});

test("2.2 Invalid Login (Negative Testing)", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill("invalid@test.com");
  await page.locator('[data-test="password"]').fill("wrongpassword");
  await page.getByRole("button", { name: "Login" }).click();

  const errorMessage = page.locator('[data-test="login-error"]');

  await expect.soft(errorMessage).toBeVisible();
  await expect.soft(errorMessage).toContainText(/invalid|incorrect/i);
  await expect.soft(page).toHaveURL("/auth/login");
});

test("2.3 Product Search", async ({ page }) => {
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

test("2.4 Product Sorting", async ({ page }) => {
  await page.goto("/");

  // Sort products by name (A - Z)
  const sortDropdown = page.getByRole("combobox", { name: "Sort" });
  await expect(sortDropdown).toBeVisible();
  await page.getByRole("combobox", { name: "Sort" }).selectOption({ label: "Name (A - Z)" });

  const products = page.locator('[data-test="product-name"]');

  // Wait for the sorting to take effect
  await expect(products).not.toHaveCount(0);

  const productNamesText = await products.allTextContents();

  // Verify that the product names are sorted alphabetically
  const sortedNames = [...productNamesText].sort((a, b) => a.localeCompare(b));
  expect(productNamesText).toEqual(sortedNames);
});

test("2.5 Category Filtering", async ({ page }) => {
  await page.goto("/");

  const firstProduct = page.locator('[data-test="product-name"]').first();
  const unfilteredFirstProductName = await firstProduct.textContent();
  console.log("Unfiltered First Product Name:", unfilteredFirstProductName);

  // Apply category filter (e.g., "Hammer")
  const selectedCategory = page.getByRole("checkbox", { name: "Hammer" });
  await expect(selectedCategory).toBeVisible();
  await selectedCategory.check();

  // Wait for the filtering to take effect
  await expect(firstProduct).not.toHaveText(unfilteredFirstProductName!);

  // Verify all the products contain the category keyword (e.g., "Hammer")
  const filteredProducts = page.locator('[data-test="product-name"]');
  const productNames = await filteredProducts.allTextContents();
  for (const name of productNames) {
    expect(name.toLowerCase()).toContain("hammer");
  }
});

test("2.6 Contact Form", async ({ page }) => {
  await page.goto("/contact");

  // Fill this form and send the message
  await page.getByLabel("First name").fill("John");
  await page.getByLabel("Last name").fill("Smith");
  await page.getByLabel("Email address").fill("johns.1987@test.com");
  await page.getByLabel("Subject").selectOption({ label: "Customer service" });
  await page
    .getByLabel("Message")
    .fill("Hi, I am unable to login to my account with this email. I have tried resetting my password but it still doesn't work. Can you please assist me with this issue?");
  await page.getByRole("button", { name: "Send" }).click();

  // Verify the success message
  await expect(page.getByRole("alert")).toContainText(/Thanks for your message! We will contact you shortly./i);
});
