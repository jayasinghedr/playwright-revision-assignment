import { test, expect } from "@playwright/test";

// npx playwright test tests/task3-advanced.spec.ts

test("3.1 Keyboard Navigation", async ({ page }) => {
  await page.goto("/auth/login");

  const emailInput = page.getByLabel("Email");
  const passwordInput = page.locator('[data-test="password"]');
  const loginButton = page.getByRole("button", { name: "Login" });

  // Email input
  await emailInput.focus();
  await expect(emailInput).toBeFocused();
  await page.keyboard.type("customer@practicesoftwaretesting.com");

  // Password input
  await page.keyboard.press("Tab");
  await expect(passwordInput).toBeFocused();
  await page.keyboard.type("welcome01");

  // Login button
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(loginButton).toBeFocused();
  await page.keyboard.press("Enter");

  // Verify login success
  await expect(page).toHaveURL("/account");
});

test("3.2 Product Image Interaction", async ({ page }) => {
  await page.goto("/");

  // Navigate to the first product's page
  await page.locator('[data-test="product-name"]').first().click();

  // Verify the product details
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
  await expect(page.locator('[data-test="unit-price"]')).toBeVisible();
  await expect(page.locator('[data-test="unit-price"]')).toContainText(/\d+\.\d{2}/);
  const mainImage = page.locator("figure img");
  await expect(mainImage).toBeVisible();

  // When multiple thumbnails exist
  const thumbnails = page.locator('[data-test="thumbnail"]');
  const thumbnailCount = await thumbnails.count();
  if (thumbnailCount > 1) {
    const initialSrc = await mainImage.getAttribute("src");
    await thumbnails.nth(1).click();
    await expect(mainImage).not.toHaveAttribute("src", initialSrc!);
  }
});

test("3.3 Add to Cart with Quantity", async ({ page }) => {
  await page.goto("/");

  // Select a product and navigate to the product page
  const product = await page.locator('[data-test="product-name"]').filter({ hasText: /pliers/i }).first().click();
  await expect(page.locator('[data-test="product-name"]')).toContainText(/pliers/i);

  // Clear the input field and insert new quantity
  const quantityInput = page.locator('[data-test="quantity"]');
  await quantityInput.click();
  await quantityInput.press('Control+A');
  await quantityInput.fill('3');

  // Add to cart
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('[data-test="nav-cart"]')).toBeVisible();
  await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('3');

  // Navigate to the cart page and validate the cart
  await page.getByRole('link', { name: 'cart' }).click();
  await expect(page).toHaveURL('/checkout');
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.locator('[data-test="product-title"]')).toContainText(/pliers/i);
  await expect(page.locator('[data-test="product-quantity"]')).toHaveValue('3');
});

test("3.4 Hover Effects on Title Bar", async ({ page }) => {
  await page.goto("/");

  const titleBarLogo = page.locator('.navbar-brand');
  await expect(titleBarLogo).toBeVisible();
  await titleBarLogo.hover();

  await expect(titleBarLogo).toHaveAttribute('title', 'Practice Software Testing - Toolshop');

  // The ToolTip that appears on hover could not be captured
});

test("3.5 Browser Back/Forward Navigation", async ({ page }) => {
  await page.goto("/");

  // Navigate to a product page
  await page.locator('[data-test="product-name"]').filter({ hasText: /hammer/i }).first().click();
  await expect(page.locator('[data-test="product-name"]')).toContainText(/hammer/i);
  const currentUrl = page.url();

  // Navigate back to the home page
  await page.goBack();
  await expect(page).toHaveURL("/");

  // Navigate forward to the product page
  await page.goForward();
  await expect(page.locator('[data-test="product-name"]')).toContainText(/hammer/i);
  await expect(page).toHaveURL(currentUrl);
});

test("3.6 Multi-Step Form with Keyboard Shortcuts", async ({ page }) => {
  await page.goto("/auth/register");

  // Input fields
  const firstNameInput = page.getByLabel("First name");
  const lastNameInput = page.getByLabel("Last name");
  const birthDateInput = page.getByLabel("Date of Birth");
  const countryDropdown = page.getByRole("combobox", { name: "Country" });
  const postalCodeInput = page.getByLabel("Postal code");
  const houseNumberInput = page.getByLabel("House number");
  const streetInput = page.getByLabel("Street");
  const cityInput = page.getByLabel("City");
  const stateInput = page.getByLabel("State");
  const phoneNumberInput = page.getByLabel("Phone");
  const emailInput = page.getByLabel("Email address");
  const passwordInput = page.getByLabel("Password");

  // Fill in the registraion form
  await firstNameInput.fill("John");
  await page.keyboard.press("Tab");
  await expect(lastNameInput).toBeFocused();
  await lastNameInput.fill("Smith");
  await page.keyboard.press("Tab");
  await expect(birthDateInput).toBeFocused();
  await birthDateInput.fill("1990-01-01");
  await page.keyboard.press("Tab");
  await expect(countryDropdown).toBeFocused();
  await countryDropdown.selectOption({ label: "France" });
  await page.keyboard.press("Tab");
  await expect(postalCodeInput).toBeFocused();
  await postalCodeInput.fill("10001");
  await page.keyboard.press("Tab");
  await expect(houseNumberInput).toBeFocused();
  await houseNumberInput.fill("123");
  await page.keyboard.press("Tab");
  await expect(streetInput).toBeFocused();
  await streetInput.fill("Rue de la Paix");
  await page.keyboard.press("Tab");
  await expect(cityInput).toBeFocused();
  await cityInput.fill("Paris");
  await page.keyboard.press("Tab");
  await expect(stateInput).toBeFocused();
  await stateInput.fill("Ile-de-France");
  await page.keyboard.press("Tab");
  await expect(phoneNumberInput).toBeFocused();
  await phoneNumberInput.fill("1234567890");
  await page.keyboard.press("Tab");
  await expect(emailInput).toBeFocused();
  await emailInput.fill("john.smith@example.com");
  await page.keyboard.press("Tab");
  await expect(passwordInput).toBeFocused();
  await passwordInput.fill("Password123");

  // Verify the inputs
  await expect(firstNameInput).toHaveValue("John");
  await expect(lastNameInput).toHaveValue("Smith");
  await expect(birthDateInput).toHaveValue("1990-01-01");
  await expect(countryDropdown).toHaveValue("FR");
  await expect(postalCodeInput).toHaveValue("10001");
  await expect(houseNumberInput).toHaveValue("123");
  await expect(streetInput).toHaveValue("Rue de la Paix");
  await expect(cityInput).toHaveValue("Paris");
  await expect(stateInput).toHaveValue("Ile-de-France");
  await expect(phoneNumberInput).toHaveValue("1234567890");
  await expect(emailInput).toHaveValue("john.smith@example.com");
  await expect(passwordInput).toHaveValue("Password123");
});