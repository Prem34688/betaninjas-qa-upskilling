/**
 * Exploratory Charter: SauceDemo End-to-End Shopping Flow
 *
 * Tester: Claude (AI exploratory agent)
 * Charter source: betaninjas-qa-upskilling task description
 *
 * Each step maps to the numbered items in the charter.
 * Screenshots are captured at every major checkpoint.
 * Console observations and UX friction notes are embedded as comments.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ── Helpers ──────────────────────────────────────────────────────────────────

const screenshotDir = path.join(__dirname, '..', 'exploratory-screenshots');

async function shot(page: import('@playwright/test').Page, name: string) {
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true,
  });
}

// ── Charter test ─────────────────────────────────────────────────────────────

test.describe('Exploratory Charter — SauceDemo Shopping Flow', () => {

  // ── Step 1 & 2 run without any stored session ──────────────────────────────
  test('Step 1 — Login page loads at root URL', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // Verify the login form is present
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();

    // UX observation: page title is "Swag Labs", not "SauceDemo" — minor brand mismatch
    const title = await page.title();
    console.log(`[Step 1] Page title: "${title}"`);

    await shot(page, '01-login-page');
  });

  test('Step 2 — Direct access to /inventory.html without session redirects to login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    // Expected: redirected back to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // UX observation: no visible error message explaining WHY the user was redirected
    const errorVisible = await page.getByTestId('error').isVisible();
    console.log(`[Step 2] Error message visible after redirect: ${errorVisible}`);

    await shot(page, '02-unauthenticated-redirect');
  });

  // ── Steps 3–11 share a login session ──────────────────────────────────────
  test.describe('Authenticated flow (Steps 3 – 11)', () => {

    test('Steps 3–11 — Full shopping charter', async ({ page }) => {

      // ── Step 3: Login ──────────────────────────────────────────────────────
      await page.goto('https://www.saucedemo.com');
      await page.getByTestId('username').fill('standard_user');
      await page.getByTestId('password').fill('secret_sauce');
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(page.getByText('Products')).toBeVisible();
      console.log('[Step 3] PASS — Logged in, inventory page loaded');
      await shot(page, '03-inventory-after-login');

      // ── Step 4: Sort by Price (Low to High) ───────────────────────────────
      const sortDropdown = page.getByRole('combobox');
      await sortDropdown.selectOption('lohi');

      // Collect product names and prices after sorting
      const productNames = await page.getByTestId('inventory-item-name').allTextContents();
      const productPrices = await page.locator('.inventory_item_price').allTextContents();

      console.log('[Step 4] Products sorted Low→High:');
      productNames.forEach((name, i) => console.log(`  ${i + 1}. ${name} — ${productPrices[i]}`));

      // Verify prices are in ascending order
      const numericPrices = productPrices.map(p => parseFloat(p.replace('$', '')));
      const isSorted = numericPrices.every((v, i, a) => i === 0 || a[i - 1] <= v);
      console.log(`[Step 4] Prices ascending: ${isSorted}`);
      expect(isSorted).toBe(true);

      await shot(page, '04-sorted-price-low-high');

      // ── Step 5: Add all 6 products to cart ────────────────────────────────
      const addButtons = page.getByRole('button', { name: 'Add to cart' });
      const buttonCount = await addButtons.count();
      console.log(`[Step 5] Found ${buttonCount} "Add to cart" buttons`);

      for (let i = 0; i < buttonCount; i++) {
        await page.getByRole('button', { name: 'Add to cart' }).first().click();
      }

      const cartBadge = page.locator('.shopping_cart_badge');
      await expect(cartBadge).toHaveText('6');
      console.log('[Step 5] PASS — Cart badge shows 6');
      await shot(page, '05-all-6-added-to-cart');

      // ── Step 6: Navigate to cart, verify all 6 items ──────────────────────
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

      const cartItems = page.locator('.cart_item');
      const cartItemCount = await cartItems.count();
      console.log(`[Step 6] Cart item count: ${cartItemCount}`);
      expect(cartItemCount).toBe(6);
      console.log('[Step 6] PASS — All 6 items in cart');
      await shot(page, '06-cart-with-6-items');

      // ── Step 7: Remove one item, verify count drops to 5 ──────────────────
      // Note the name of the first item before removal for observation
      const firstItemName = await page.locator('.inventory_item_name').first().textContent();
      console.log(`[Step 7] Removing: "${firstItemName}"`);

      await page.getByRole('button', { name: 'Remove' }).first().click();

      const updatedCartItems = page.locator('.cart_item');
      const updatedCount = await updatedCartItems.count();
      expect(updatedCount).toBe(5);

      // Cart badge should show 5
      await expect(cartBadge).toHaveText('5');
      console.log('[Step 7] PASS — Cart shows 5 items, badge = 5');
      await shot(page, '07-cart-after-removal');

      // ── Step 8: Continue Shopping → back to inventory ──────────────────────
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

      // UX observation: sort order resets to default after returning — note it
      const currentSort = await sortDropdown.inputValue();
      console.log(`[Step 8] Sort option after returning: "${currentSort}" (was "lohi")`);
      console.log('[Step 8] PASS — Back on inventory page');
      await shot(page, '08-back-to-inventory');

      // ── Step 9: Checkout — fill info ──────────────────────────────────────
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
      await page.getByRole('button', { name: 'Checkout' }).click();
      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

      await page.getByTestId('firstName').fill('Beta');
      await page.getByTestId('lastName').fill('Ninja');
      await page.getByTestId('postalCode').fill('10001');
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
      console.log('[Step 9] PASS — Checkout info submitted, on order summary');
      await shot(page, '09-checkout-info-filled');

      // ── Step 10: Order summary — item total and tax ────────────────────────
      const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
      const taxText = await page.locator('.summary_tax_label').textContent();
      const orderTotalText = await page.locator('.summary_total_label').textContent();

      console.log(`[Step 10] Item total: ${itemTotalText}`);
      console.log(`[Step 10] Tax:        ${taxText}`);
      console.log(`[Step 10] Order total:${orderTotalText}`);

      // Verify item total matches sum of individual prices shown
      const summaryPrices = await page.locator('.inventory_item_price').allTextContents();
      const computedTotal = summaryPrices.reduce((sum, p) => sum + parseFloat(p.replace('$', '')), 0);
      const displayedSubtotal = parseFloat((itemTotalText ?? '').replace(/[^0-9.]/g, ''));
      console.log(`[Step 10] Computed total: $${computedTotal.toFixed(2)}, Displayed: $${displayedSubtotal.toFixed(2)}`);
      expect(Math.abs(computedTotal - displayedSubtotal)).toBeLessThan(0.01);
      console.log('[Step 10] PASS — Item total matches sum of products');
      await shot(page, '10-order-summary');

      // ── Step 11: Finish — confirmation message ─────────────────────────────
      await page.getByRole('button', { name: 'Finish' }).click();
      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

      const heading = page.getByRole('heading', { name: 'Thank you for your order!' });
      await expect(heading).toBeVisible();

      const dispatchText = await page.locator('.complete-text').textContent();
      console.log(`[Step 11] Confirmation message: "${dispatchText}"`);
      console.log('[Step 11] PASS — Order confirmed');
      await shot(page, '11-order-confirmation');

      // Verify cart badge is gone after order completion
      const badgeAfterOrder = await page.locator('.shopping_cart_badge').isVisible();
      console.log(`[Step 11] Cart badge visible after order: ${badgeAfterOrder} (expected: false)`);
      expect(badgeAfterOrder).toBe(false);
    });
  });
});
