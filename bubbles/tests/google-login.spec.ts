import { test, expect } from '../fixtures';
import { GoogleOAuthPage } from '../pages/GoogleOAuthPage';

const GOOGLE_EMAIL = process.env.BUBBLES_GOOGLE_EMAIL;
const GOOGLE_PASSWORD = process.env.BUBBLES_GOOGLE_PASSWORD;

test.describe('Login — Continue with Google', () => {

  test.beforeEach(() => {
    if (!GOOGLE_EMAIL || !GOOGLE_PASSWORD) {
      test.skip(true, 'Missing BUBBLES_GOOGLE_EMAIL / BUBBLES_GOOGLE_PASSWORD env vars');
    }
  });

  test('should land on Bubbles Home screen after Google login', async ({ loginPage, page, context }) => {
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

    await expect(page).toHaveURL(/app\.usebubbles\.com/);
    await expect(page.getByRole('navigation')).toBeVisible();
  });

});
