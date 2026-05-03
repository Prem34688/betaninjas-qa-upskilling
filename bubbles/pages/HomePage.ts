import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly nav: Locator;
  readonly profileButton: Locator;
  readonly newBubbleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole('navigation');
    this.profileButton = page.getByRole('button', { name: /profile|avatar|account/i });
    this.newBubbleButton = page.getByRole('button', { name: /new bubble|create/i });
  }

  async isLoaded() {
    await this.nav.waitFor({ state: 'visible' });
  }
}
