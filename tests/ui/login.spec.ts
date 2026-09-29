import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in', async ({ page }) => {

    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('locked out user sees an error', async () => {

    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.error).toContainText('locked out');
  });

  test('login with wrong credentials', async () => {

    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.error).toContainText('do not match');
  });
});
