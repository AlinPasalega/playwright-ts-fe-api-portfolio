import { test, expect } from '@playwright/test';

test.describe('cart checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  })
  test('add item to cart and check badge', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('add multiple items to cart and check badge', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
  });


  test('remove item from cart and check badge', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeHidden();
  });

  test('checkout happy path', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');

    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();

    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

  })
});