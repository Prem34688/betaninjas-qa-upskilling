import { Page, Locator } from '@playwright/test';

export class GoogleOAuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    // Google renders a hidden autofill input alongside the real one — exclude it
    this.passwordInput = page.locator('input[type="password"]:not([aria-hidden="true"])');
    this.nextButton = page.getByRole('button', { name: /next/i });
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
    await this.nextButton.click();
  }

  async enterPassword(password: string) {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
    await this.nextButton.click();
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
  }
}
