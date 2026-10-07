import { CheckoutPage } from '../../pages/CheckoutPage';

import { test, expect } from '../fixtures';

const errorCases = [
  {
    field: 'first name',
    first: '',
    last: 'Doe',
    zip: '12345',
    error: 'Error: First Name is required',
  },
  {
    field: 'last name',
    first: 'John',
    last: '',
    zip: '12345',
    error: 'Error: Last Name is required',
  },
  {
    field: 'postal code',
    first: 'John',
    last: 'Doe',
    zip: '',
    error: 'Error: Postal Code is required',
  },
];

test.describe('Checkout Validation', () => {
  for (const errorCase of errorCases) {
    test(
      `shows error when ${errorCase.field} is missing`,
      { tag: '@regression' },
      async ({ loggedInPage }) => {
        await loggedInPage.goto('/checkout-step-one.html');
        const checkout = new CheckoutPage(loggedInPage);
        await checkout.fillInfo(errorCase.first, errorCase.last, errorCase.zip);
        await checkout.continue();
        await expect(checkout.getErrorMessage()).toHaveText(errorCase.error);
      },
    );
  }
});
