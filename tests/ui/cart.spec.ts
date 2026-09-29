import { test, expect } from '../fixtures';

test.describe('cart checkout', () => {
  
  test('add item to cart and check badge', async ({ loggedInPage }) => {
    await loggedInPage.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(loggedInPage.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('add multiple items to cart and check badge', async ({ loggedInPage }) => {
    await loggedInPage.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await loggedInPage.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click();
    await expect(loggedInPage.getByTestId('shopping-cart-badge')).toHaveText('2');
  });


  test('remove item from cart and check badge', async ({ loggedInPage }) => {
    await loggedInPage.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(loggedInPage.getByTestId('shopping-cart-badge')).toHaveText('1');

    await loggedInPage.getByTestId('remove-sauce-labs-backpack').click();
    await expect(loggedInPage.getByTestId('shopping-cart-badge')).toBeHidden();
  });

  test('checkout happy path', async ({ loggedInPage }) => {
    await loggedInPage.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(loggedInPage.getByTestId('shopping-cart-badge')).toHaveText('1');

    await loggedInPage.getByTestId('shopping-cart-link').click();
    await expect(loggedInPage).toHaveURL(/cart/);
    await expect(loggedInPage.getByTestId('title')).toHaveText('Your Cart');

    await loggedInPage.getByTestId('checkout').click();
    await expect(loggedInPage).toHaveURL(/checkout-step-one/);
    await expect(loggedInPage.getByTestId('title')).toHaveText('Checkout: Your Information');

    await loggedInPage.getByTestId('firstName').fill('John');
    await loggedInPage.getByTestId('lastName').fill('Doe');
    await loggedInPage.getByTestId('postalCode').fill('12345');
    await loggedInPage.getByTestId('continue').click();

    await expect(loggedInPage).toHaveURL(/checkout-step-two/);
    await expect(loggedInPage.getByTestId('title')).toHaveText('Checkout: Overview');

    await loggedInPage.getByTestId('finish').click();
    await expect(loggedInPage).toHaveURL(/checkout-complete/);
    await expect(loggedInPage.getByTestId('title')).toHaveText('Checkout: Complete!');
    await expect(loggedInPage.getByTestId('complete-header')).toHaveText('Thank you for your order!');

  })
});