import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly continueWithGoogleButton: Locator;
  readonly continueWithMicrosoftButton: Locator;
  readonly nameInput: Locator;
  readonly workEmailInput: Locator;
  readonly continueWithEmailButton: Locator;
  readonly logInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // OAuth buttons are styled-component divs — text lives in a hidden inner div,
    // so we locate by text then step up to the visible clickable parent.
    this.continueWithGoogleButton = page.getByText('Continue with Google', { exact: true }).locator('xpath=..');
    this.continueWithMicrosoftButton = page.getByText('Continue with Microsoft', { exact: true }).locator('xpath=..');
    this.nameInput = page.getByPlaceholder('Name');
    this.workEmailInput = page.getByPlaceholder('Work email');
    this.continueWithEmailButton = page.getByRole('button', { name: 'Continue with email' });
    this.logInLink = page.getByRole('button', { name: 'Log in' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickContinueWithGoogle() {
    await this.continueWithGoogleButton.click();
  }
}
