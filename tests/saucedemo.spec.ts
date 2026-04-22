import { test, expect } from '@playwright/test';

test.describe('Saucedemo E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });
  
// Test 1 — Successful Login
test('successful login', async ({ page }) => {
  // Act
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.getByText('Products')).toBeVisible();
});

  // Test 2 — Failed Login
  test('failed login with wrong credentials', async ({ page }) => {
    // Act
    await page.getByTestId('username').fill('wrong_user');
    await page.getByTestId('password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username and password do not match');
  });

  // Test 3 — Add to Cart
  test('add item to cart', async ({ page }) => {
    // Arrange — login first
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Act
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Assert
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // Test 4 — Checkout Happy Path
  test('checkout happy path', async ({ page }) => {
    // Arrange — login and add item
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Act — go through checkout
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByTestId('firstName').fill('Beta');
    await page.getByTestId('lastName').fill('Ninja');
    await page.getByTestId('postalCode').fill('10001');
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: 'Finish' }).click();

    // Assert
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });

  // Test 5 — Form Validation
  test('checkout form validation — empty fields', async ({ page }) => {
    // Arrange — login, add item, reach checkout form
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Act — submit empty form
    await page.getByRole('button', { name: 'Continue' }).click();

    // Assert — error message appears
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('First Name is required');
  });
});