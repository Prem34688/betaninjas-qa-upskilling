import { test, expect } from '../fixtures';
import { GoogleOAuthPage } from '../pages/GoogleOAuthPage';

const GOOGLE_EMAIL = process.env.BUBBLES_GOOGLE_EMAIL;
const GOOGLE_PASSWORD = process.env.BUBBLES_GOOGLE_PASSWORD;

test.describe('Login — Continue with Google', () => {

  // --- UI check (no credentials needed) ---

  test('should show Continue with Google button on the login page', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.continueWithGoogleButton).toBeVisible();
  });

  // --- Full OAuth flow (credentials required) ---

  test.describe('OAuth flow', () => {
    test.beforeEach(() => {
      if (!GOOGLE_EMAIL || !GOOGLE_PASSWORD) {
        test.skip(true, 'Missing BUBBLES_GOOGLE_EMAIL / BUBBLES_GOOGLE_PASSWORD env vars');
      }
    });

    test('should land on Bubbles Home screen after Google login', async ({ loginPage, homePage, page, context }) => {
      await loginPage.goto();

      const [googlePopup] = await Promise.all([
        context.waitForEvent('page'),
        loginPage.clickContinueWithGoogle(),
      ]);

      await googlePopup.waitForLoadState('domcontentloaded');

      const oauthPage = new GoogleOAuthPage(googlePopup);
      await oauthPage.login(GOOGLE_EMAIL!, GOOGLE_PASSWORD!);

      await googlePopup.waitForEvent('close', { timeout: 15_000 }).catch(() => {});
      await page.waitForURL(/app\.usebubbles\.com/, { timeout: 15_000 });

      // Assert — URL and authenticated home screen are both present
      await expect(page).toHaveURL(/app\.usebubbles\.com/);
      await homePage.isLoaded();
    });
  });

  // --- Skipped: Microsoft login (needs MS credentials) ---
  // test.describe.skip('Login — Continue with Microsoft', () => {});

  // --- Skipped: OTP login (needs Mailosaur inbox) ---
  // test.describe.skip('Login — OTP via email', () => {});

});
