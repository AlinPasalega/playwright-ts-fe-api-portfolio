import { test as base, expect, Page } from '@playwright/test';

type MyFixtures = {
    loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
    loggedInPage: async ({ page }, use) => {
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/inventory/);
        await use(page);
    },
});

export { expect };