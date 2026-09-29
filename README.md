# Playwright + TypeScript — UI & API Test Automation Portfolio

[![Playwright Tests](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml)

End-to-end test automation framework built with **Playwright** and **TypeScript**, covering UI flows on [Sauce Demo](https://www.saucedemo.com) and (coming next) REST API tests on [Restful Booker](https://restful-booker.herokuapp.com).

## Tech stack

- Playwright Test + TypeScript
- Page Object Model
- Custom fixtures (`test.extend`)
- Authenticated sessions with `storageState` (setup project)
- Environment config with `dotenv`
- GitHub Actions CI on Chromium, Firefox and WebKit

## What's covered

**Login**
- Standard user logs in and lands on Products
- Locked-out user sees an error
- Wrong password shows a validation error

**Cart & checkout**
- Add one item and check the cart badge
- Add multiple items and check the badge count
- Remove an item and check the badge disappears
- Full checkout happy path to the order confirmation page

## Project structure

```
.github/workflows/playwright.yml   # CI pipeline
pages/                             # Page objects
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
tests/
  auth.setup.ts                    # Logs in once and saves the session
  fixtures.ts                      # loggedInPage fixture
  ui/
    login.spec.ts
    cart.spec.ts
playwright.config.ts
.env.example
```

## Design decisions

- **Page objects** keep locators and actions in one place, so tests read like user steps and a UI change is fixed once.
- **Login once per run**: a setup project authenticates and saves the session with `storageState`; cart and checkout tests reuse it and start directly on the inventory page. Login tests clear the state so they still exercise the real login form.
- **Stable locators** via `data-test` attributes (`testIdAttribute: 'data-test'`).
- **No hardcoded credentials**: values come from `.env` locally and GitHub secrets in CI.

## Getting started

```bash
git clone https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio.git
cd playwright-ts-fe-api-portfolio
npm ci
npx playwright install --with-deps
cp .env.example .env   # then fill in the values
```

`.env`:

```
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```

## Running tests

```bash
npx playwright test                    # all tests, all browsers
npx playwright test --project=chromium # one browser
npx playwright test --ui               # interactive UI mode
npx playwright show-report             # open the HTML report
```

## CI

Every push and pull request to `main` runs the full suite on Chromium, Firefox and WebKit via GitHub Actions. The HTML report is uploaded as a build artifact. Credentials are provided through repository secrets `SAUCE_USERNAME` and `SAUCE_PASSWORD`.

## Roadmap

- [x] UI tests for login, cart and checkout
- [x] Page Object Model and fixtures
- [x] Session reuse with `storageState`
- [x] CI on three browsers
- [ ] API tests for Restful Booker (auth token, CRUD bookings, negative cases)
- [ ] `@smoke` / `@regression` tags

## Author

**Alin Pasalega**, QA Automation Engineer
[LinkedIn](https://www.linkedin.com/in/alin-alexandru-pasalega-341ab7142/)
