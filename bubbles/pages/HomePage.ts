import { Page, Locator } from '@playwright/test';

// TODO: locators below need verification via MCP once full OAuth flow completes.
// Expected structure: left sidebar nav, profile button top-right, new recording button.
export class HomePage {
  readonly page: Page;
  readonly nav: Locator;
  readonly profileButton: Locator;
  readonly newBubbleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole('navigation');
    this.profileButton = page.getByRole('button', { name: /profile|avatar|account/i });
    this.newBubbleButton = page.getByRole('button', { name: /new|create|record/i });
  }

  async isLoaded() {
    await this.nav.waitFor({ state: 'visible' });
  }
}
