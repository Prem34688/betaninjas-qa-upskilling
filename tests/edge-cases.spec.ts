import { test, expect } from './fixtures';

const { SAUCE_USERNAME, SAUCE_PASSWORD } = process.env;

// ── Feature 1: User Authentication — Edge Cases ──────────────────────────────

test.describe('User Authentication — Edge Cases', () => {
  test('SQL injection in username does not crash or authenticate', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login("' OR '1'='1", 'secret_sauce');

    // Assert — still on login page with error
    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('script tag in username does not crash or authenticate', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('<script>alert(1)</script>', 'secret_sauce');

    // Assert — still on login page with error
    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('error_user authenticates successfully despite degraded behaviour', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('error_user', 'secret_sauce');

    // Assert
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.getByTestId('inventory-container')).toBeVisible();
  });

  test('performance_glitch_user authenticates successfully despite intentional delay', async ({ loginPage, page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('performance_glitch_user', 'secret_sauce');

    // Assert — extended timeout to accommodate the intentional delay
    await expect(page).toHaveURL('/inventory.html', { timeout: 15_000 });
    await expect(page.getByTestId('inventory-container')).toBeVisible({ timeout: 15_000 });
  });

  test('accessing /inventory.html without a session redirects to the login page', async ({ page }) => {
    // Arrange — no login performed

    // Act
    await page.goto('/inventory.html');

    // Assert
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('session does not persist after explicit logout — back button stays on login page', async ({ loginPage, page }) => {
    // Arrange — log in and verify we reached the store
    await loginPage.goto();
    await loginPage.login(SAUCE_USERNAME!, SAUCE_PASSWORD!);
    await expect(page).toHaveURL('/inventory.html');

    // Act — logout via the burger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/');

    // Navigate back in browser history
    await page.goBack();

    // Assert — app detects missing session and shows the login form
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});

// ── Feature 2: Product Inventory — Sorting ───────────────────────────────────

test.describe('Product Inventory — Sorting', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(SAUCE_USERNAME!, SAUCE_PASSWORD!);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('default sort order is Name (A→Z)', async ({ inventoryPage }) => {
    // Arrange — on inventory page with default sort applied

    // Act
    const names = await inventoryPage.getProductNames();

    // Assert — list is already in ascending alphabetical order
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorting by Name (Z→A) reverses alphabetical order', async ({ inventoryPage }) => {
    // Arrange
    const defaultNames = await inventoryPage.getProductNames();

    // Act
    await inventoryPage.sortBy('za');

    // Assert — reversed relative to A→Z
    const sortedNames = await inventoryPage.getProductNames();
    expect(sortedNames).toEqual([...defaultNames].reverse());
  });

  test('sorting by Price (Low→High) puts the cheapest product first', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.sortBy('lohi');

    // Assert
    const names = await inventoryPage.getProductNames();
    expect(names[0]).toBe('Sauce Labs Onesie');
    expect(names[names.length - 1]).toBe('Sauce Labs Fleece Jacket');
  });

  test('sorting by Price (High→Low) puts the most expensive product first', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.sortBy('hilo');

    // Assert
    const names = await inventoryPage.getProductNames();
    expect(names[0]).toBe('Sauce Labs Fleece Jacket');
    expect(names[names.length - 1]).toBe('Sauce Labs Onesie');
  });

  test('changing sort order does not reset the cart badge count', async ({ inventoryPage }) => {
    // Arrange — add one item so the badge appears
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Act — sort by Z→A
    await inventoryPage.sortBy('za');

    // Assert — badge unchanged
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('no products are duplicated or missing after sorting through all options', async ({ inventoryPage }) => {
    const EXPECTED_COUNT = 6;

    for (const option of ['az', 'za', 'lohi', 'hilo']) {
      // Act
      await inventoryPage.sortBy(option);

      // Assert — exactly 6 products shown
      const names = await inventoryPage.getProductNames();
      expect(names).toHaveLength(EXPECTED_COUNT);
    }
  });
});

// ── Feature 3: Shopping Cart — Add / Remove All 6 Products ───────────────────

test.describe('Shopping Cart — Add and Remove All 6 Products', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(SAUCE_USERNAME!, SAUCE_PASSWORD!);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('adding all 6 products shows a cart badge of 6', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.addAllToCart();

    // Assert
    await expect(inventoryPage.cartBadge).toHaveText('6');
  });

  test('cart page lists all 6 products after adding them all from the inventory', async ({ inventoryPage, cartPage, page }) => {
    // Arrange
    await inventoryPage.addAllToCart();

    // Act
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');

    // Assert — one Remove button per item
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(6);
  });

  test('removing all 6 products from the inventory page clears the cart badge', async ({ inventoryPage }) => {
    // Arrange
    await inventoryPage.addAllToCart();
    await expect(inventoryPage.cartBadge).toHaveText('6');

    // Act — click every Remove button on the inventory page
    await inventoryPage.removeAllFromInventory();

    // Assert — badge is gone once the cart is empty
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('removing one product from the cart page leaves the other 5 intact', async ({ inventoryPage, cartPage, page }) => {
    // Arrange — fill the cart and navigate to it
    await inventoryPage.addAllToCart();
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');
    expect(await cartPage.getCartItemCount()).toBe(6);

    // Act — remove the first cart item
    await cartPage.removeButtons.first().click();

    // Assert — exactly 5 items remain
    expect(await cartPage.getCartItemCount()).toBe(5);
  });

  test('cart contents persist when navigating between inventory and cart pages', async ({ inventoryPage, cartPage, page }) => {
    // Arrange — add one item
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Act — go to cart then return to inventory via Continue Shopping
    await inventoryPage.goToCart();
    await expect(page).toHaveURL('/cart.html');
    await cartPage.continueShopping();
    await expect(page).toHaveURL('/inventory.html');

    // Assert — badge still shows the original item
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('each Add to cart button changes to Remove after clicking, incrementing the badge', async ({ inventoryPage }) => {
    // Act — add all products one by one and verify badge after each
    const allAddButtons = inventoryPage.page.getByRole('button', { name: 'Add to cart' });
    const total = await allAddButtons.count();

    for (let i = 1; i <= total; i++) {
      await inventoryPage.page.getByRole('button', { name: 'Add to cart' }).first().click();
      await expect(inventoryPage.cartBadge).toHaveText(String(i));
    }

    // Assert — all Add to cart buttons have been replaced by Remove buttons
    await expect(inventoryPage.page.getByRole('button', { name: 'Add to cart' })).toHaveCount(0);
    await expect(inventoryPage.page.getByRole('button', { name: 'Remove' })).toHaveCount(6);
  });
});
