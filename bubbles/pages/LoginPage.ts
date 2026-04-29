import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly continueWithGoogleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueWithGoogleButton = page.getByRole('button', { name: /continue with google/i });
  }

  async goto() {
    await this.page.goto('https://app.usebubbles.com');
  }

  async clickContinueWithGoogle() {
    await this.continueWithGoogleButton.click();
  }
}
