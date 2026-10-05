import { InventoryPage } from '../../pages/InventoryPage';

import { test, expect } from '../fixtures';

test.describe('Inventory Page', () => {
  test('sorts products Z to A', { tag: '@regression' }, async ({ loggedInPage }) => {
    const inventory = new InventoryPage(loggedInPage);
    await inventory.sortProducts('za');
    const names = await inventory.getProductNames();
    const expected = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(expected);
  });

  test('log out flow', { tag: '@regression' }, async ({ loggedInPage }) => {
    const inventory = new InventoryPage(loggedInPage);
    await inventory.openBurgerMenuLogout();
    await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/');
    await expect(loggedInPage.getByTestId('login-button')).toBeVisible();
  });
});
