import { test, expect } from '../fixtures';

test.describe('Login — Continue with Google', () => {

  // --- UI check — verify login page elements without auth ---

  test.use({ storageState: { cookies: [], origins: [] } });

  test('should show Continue with Google button on the login page', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.continueWithGoogleButton).toBeVisible();
    await expect(loginPage.continueWithMicrosoftButton).toBeVisible();
    await expect(loginPage.logInLink).toBeVisible();
  });

  // --- Authenticated — verify home screen loads after Google login ---

  test('should land on Bubbles Home screen after Google login', async ({ homePage, page }) => {
    // storageState is pre-loaded by global.setup.ts — already authenticated
    await page.goto('/');

    await expect(page).toHaveURL(/app\.usebubbles\.com/);
    await homePage.isLoaded();
  });

  // --- Skipped: Microsoft login (needs MS credentials) ---
  // test.describe.skip('Login — Continue with Microsoft', () => {});

  // --- Skipped: OTP login (needs Mailosaur inbox) ---
  // test.describe.skip('Login — OTP via email', () => {});

});
