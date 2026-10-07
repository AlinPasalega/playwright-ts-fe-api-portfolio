import { InventoryPage } from '../../pages/InventoryPage';

import { test, expect } from '../fixtures';

const sortCases = [
  { label: 'Name (A to Z)', value: 'az', type: 'name', order: 'asc' },
  { label: 'Name (Z to A)', value: 'za', type: 'name', order: 'desc' },
  { label: 'Price (low to high)', value: 'lohi', type: 'price', order: 'asc' },
  { label: 'Price (high to low)', value: 'hilo', type: 'price', order: 'desc' },
];

test.describe('Inventory Page', () => {
  for (const sortCase of sortCases) {
    test(`sorts by ${sortCase.label}`, { tag: '@regression' }, async ({ loggedInPage }) => {
      const inventory = new InventoryPage(loggedInPage);
      await inventory.sortProducts(sortCase.value);

      if (sortCase.type === 'name') {
        const names = await inventory.getProductNames();
        const expected = [...names].sort((a, b) => a.localeCompare(b));
        if (sortCase.order === 'desc') expected.reverse();
        expect(names).toEqual(expected);
      } else {
        const prices = await inventory.getProductPrices();
        const expected = [...prices].sort((a, b) => a - b);
        if (sortCase.order === 'desc') expected.reverse();
        expect(prices).toEqual(expected);
      }
    });
  }

  test(
    'cart badge updates when adding and removing products',
    { tag: '@regression' },
    async ({ loggedInPage }) => {
      const inventory = new InventoryPage(loggedInPage);
      await inventory.addToCart('sauce-labs-backpack');
      await inventory.addToCart('sauce-labs-bike-light');
      await inventory.addToCart('sauce-labs-bolt-t-shirt');
      await expect(inventory.getCartBadge()).toHaveText('3');
      await inventory.removeFromCart('sauce-labs-bike-light');
      await expect(inventory.getCartBadge()).toHaveText('2');
    },
  );

  test('log out flow', { tag: '@regression' }, async ({ loggedInPage }) => {
    const inventory = new InventoryPage(loggedInPage);
    await inventory.openBurgerMenuLogout();
    await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/');
    await expect(loggedInPage.getByTestId('login-button')).toBeVisible();
  });
});
