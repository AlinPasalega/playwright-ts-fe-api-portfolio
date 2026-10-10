import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortContainer: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    this.shoppingCartLink = page.getByTestId('shopping-cart-link');
    this.sortContainer = page.getByTestId('product-sort-container');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('#logout_sidebar_link');
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

  async sortProducts(sortOption: string) {
    await this.sortContainer.selectOption(sortOption);
  }
  async getProductNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }
  async openBurgerMenuLogout() {
    await this.burgerMenuButton.click();
    await this.logoutButton.dispatchEvent('click');
  }

  async getProductPrices() {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((text) => parseFloat(text.replace('$', '')));
  }

  async addToCartByName(name: string) {
    await this.page
      .getByTestId('inventory-item')
      .filter({ hasText: name })
      .getByRole('button', { name: /add to cart|remove/i })
      .click();
  }
  getCartBadge() {
    return this.shoppingCartBadge;
  }

  async getFirstProduct() {
    const name = await this.page.locator('.inventory_item_name').first().textContent();
    const price = await this.page.locator('.inventory_item_price').first().textContent();
    return { name, price };
  }

  async openProductByName(name: string) {
    await this.page.locator('.inventory_item_name', { hasText: name }).click();
  }
}
