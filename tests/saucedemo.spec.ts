import { test, expect } from './fixtures';

const { SAUCE_USERNAME, SAUCE_PASSWORD } = process.env;

const validLoginCases = [
  { user: SAUCE_USERNAME!, pass: SAUCE_PASSWORD! },
];

const invalidLoginCases = [
  { description: 'valid username, invalid password', user: SAUCE_USERNAME!, pass: 'wrong_pass',    error: 'do not match' },
  { description: 'invalid username, valid password', user: 'wrong_user',    pass: SAUCE_PASSWORD!, error: 'do not match' },
  { description: 'locked out user',                  user: 'locked_out_user', pass: SAUCE_PASSWORD!, error: 'locked out' },
  { description: 'username only, no password',       user: SAUCE_USERNAME!, pass: '',              error: 'Password is required' },
  { description: 'password only, no username',       user: '',              pass: SAUCE_PASSWORD!, error: 'Username is required' },
  { description: 'both fields empty',                user: '',              pass: '',              error: 'Username is required' },
];

test.describe('Saucedemo E2E Suite', () => {

  // --- Parameterized login tests ---
  test.describe('Login', () => {
    for (const { user, pass } of validLoginCases) {
      test(`valid login: ${user}`, async ({ loginPage, page }) => {
        await loginPage.goto();
        await loginPage.login(user, pass);
        await expect(page).toHaveURL('/inventory.html');
        await expect(page.getByText('Products')).toBeVisible();
      });
    }

    for (const { description, user, pass, error } of invalidLoginCases) {
      test(`invalid login: ${description}`, async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(user, pass);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(error);
      });
    }
  });

  // --- Shared setup for post-login tests ---
  test.describe('Cart & Checkout', () => {
    test.beforeEach(async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(SAUCE_USERNAME!, SAUCE_PASSWORD!);
      await expect(page).toHaveURL('/inventory.html');
    });

    test('add item to cart', async ({ inventoryPage }) => {
      await inventoryPage.addFirstItemToCart();
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    test('checkout happy path', async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addFirstItemToCart();
      await inventoryPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillInfo('Beta', 'Ninja', '10001');
      await checkoutPage.continue();
      await checkoutPage.finish();

      await expect(checkoutPage.confirmationHeading).toBeVisible();
    });

    test('checkout form validation — empty fields', async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addFirstItemToCart();
      await inventoryPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.continue();

      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });
  });
});