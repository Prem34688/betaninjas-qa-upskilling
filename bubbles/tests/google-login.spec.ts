import { test, expect } from '../fixtures';

const GOOGLE_EMAIL = process.env.BUBBLES_GOOGLE_EMAIL!;
const GOOGLE_PASSWORD = process.env.BUBBLES_GOOGLE_PASSWORD!;

test.describe('Login — Continue with Google', () => {

  test('should land on Bubbles Home screen after Google login', async ({ loginPage, googleOAuthPage, page, context }) => {
    await loginPage.goto();

    // Click "Continue with Google" and wait for the Google OAuth popup
    const [googlePopup] = await Promise.all([
      context.waitForEvent('page'),
      loginPage.clickContinueWithGoogle(),
    ]);

    await googlePopup.waitForLoadState('domcontentloaded');

    // Complete Google OAuth in the popup
    const oauthPage = new (await import('../pages/GoogleOAuthPage')).GoogleOAuthPage(googlePopup);
    await oauthPage.login(GOOGLE_EMAIL, GOOGLE_PASSWORD);

    // Wait for popup to close and app to redirect
    await googlePopup.waitForEvent('close', { timeout: 15_000 }).catch(() => {});
    await page.waitForURL(/app\.usebubbles\.com/, { timeout: 15_000 });

    // Assert — user is on the Bubbles Home screen
    await expect(page).toHaveURL(/app\.usebubbles\.com/);
  });

});
