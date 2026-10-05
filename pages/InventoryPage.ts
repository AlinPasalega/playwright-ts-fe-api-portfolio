import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    this.shoppingCartLink = page.getByTestId('shopping-cart-link');
  }

  async addToCart(item: string) {
    await this.page.getByTestId(`add-to-cart-${item}`).click();
  }

  async removeFromCart(item: string) {
    await this.page.getByTestId(`remove-${item}`).click();
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }
}
