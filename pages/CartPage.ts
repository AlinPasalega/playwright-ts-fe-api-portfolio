import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.checkoutButton = page.getByTestId('checkout');
        this.continueShoppingButton = page.getByTestId('continue-shopping');

    }
    async checkout() {
        await this.checkoutButton.click();
    }

    async removeFromCart(item: string) {
        await this.page.getByTestId(`remove-${item}`).click();
    }
}