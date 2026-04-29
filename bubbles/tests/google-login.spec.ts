import { test, expect } from '../fixtures';
import { GoogleOAuthPage } from '../pages/GoogleOAuthPage';

const GOOGLE_EMAIL = process.env.BUBBLES_GOOGLE_EMAIL!;
const GOOGLE_PASSWORD = process.env.BUBBLES_GOOGLE_PASSWORD!;

test.describe('Login — Continue with Google', () => {

  test('should land on Bubbles Home screen after Google login', async ({ loginPage, page }) => {
    await loginPage.goto();

    // Click "Continue with Google" — opens Google OAuth as a same-tab redirect
    await loginPage.clickContinueWithGoogle();

    // Wait for redirect to Google accounts page
    await page.waitForURL(/accounts\.google\.com/, { timeout: 15_000 });

    // Complete Google OAuth on the same page
    const oauthPage = new GoogleOAuthPage(page);
    await oauthPage.login(GOOGLE_EMAIL, GOOGLE_PASSWORD);

    // Wait for Google to redirect back to Bubbles
    await page.waitForURL(/app\.usebubbles\.com/, { timeout: 30_000 });

    // Assert — user is on the Bubbles Home screen
    await expect(page).toHaveURL(/app\.usebubbles\.com/);
  });

});
