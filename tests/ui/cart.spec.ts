import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { InventoryPage } from '../../pages/InventoryPage';

import { test, expect } from '../fixtures';

test.describe('cart checkout', () => {
 
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
   test.beforeEach(async ({ loggedInPage }) => {
    inventoryPage = new InventoryPage(loggedInPage);
    cartPage = new CartPage(loggedInPage);
    checkoutPage = new CheckoutPage(loggedInPage);
  });

  test('add item to cart and check badge', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
  });

  test('add multiple items to cart and check badge', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
  });


  test('remove item from cart and check badge', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    await inventoryPage.removeFromCart('sauce-labs-backpack');
    await expect(inventoryPage.shoppingCartBadge).toBeHidden();
  });

  test('checkout happy path', async ({ loggedInPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    await inventoryPage.openCart();
    await expect(loggedInPage).toHaveURL(/cart/);
    await expect(cartPage.title).toHaveText('Your Cart');

    await cartPage.checkout();
    await expect(loggedInPage).toHaveURL(/checkout-step-one/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');

    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    await expect(loggedInPage).toHaveURL(/checkout-step-two/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');

    await checkoutPage.finish();
    await expect(loggedInPage).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');

  })
});