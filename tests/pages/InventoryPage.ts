import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' }).first();
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.getByRole('combobox');
  }

  async addFirstItemToCart() {
    await this.addToCartButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async addAllToCart() {
    const count = await this.page.getByRole('button', { name: 'Add to cart' }).count();
    for (let i = 0; i < count; i++) {
      await this.page.getByRole('button', { name: 'Add to cart' }).first().click();
    }
  }

  async removeAllFromInventory() {
    const count = await this.page.getByRole('button', { name: 'Remove' }).count();
    for (let i = 0; i < count; i++) {
      await this.page.getByRole('button', { name: 'Remove' }).first().click();
    }
  }

  async getProductNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }
}