# Playwright + TypeScript — UI & API Test Automation Portfolio

[![Playwright Tests](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml)

📊 **[Latest test report](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/)**, published automatically after every CI run.

End-to-end test automation framework built with **Playwright** and **TypeScript**, covering UI flows on [Sauce Demo](https://www.saucedemo.com) and REST API tests on [Restful Booker](https://restful-booker.herokuapp.com).

## Tech stack

- Playwright Test + TypeScript
- Page Object Model
- Custom fixtures (`test.extend`)
- Authenticated sessions with `storageState` (setup project)
- API testing with Playwright's `request` fixture
- `@smoke` / `@regression` tags
- Environment config with `dotenv`
- GitHub Actions CI on Chromium, Firefox and WebKit, with nightly and on-demand runs
- HTML report published to GitHub Pages

## What's covered

**UI: Login**
- Standard user logs in and lands on Products
- Locked-out user sees an error
- Wrong password shows a validation error

**UI: Cart & checkout**
- Add one item and check the cart badge
- Add multiple items and check the badge count
- Remove an item and check the badge disappears
- Full checkout happy path to the order confirmation page

**API: Authentication**
- Valid credentials return a token
- Invalid credentials return no token and a "Bad credentials" reason

**API: Bookings**
- Full lifecycle in one test with `test.step`: authenticate, create, read, update, delete, confirm deletion (404)
- Negative cases: update and delete without a token return 403, a booking that doesn't exist returns 404

## Project structure

```
.github/workflows/playwright.yml   # CI pipeline + GitHub Pages report
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
  api/
    auth.spec.ts
    booking.spec.ts
    booking-negative.spec.ts
playwright.config.ts
.env.example
```

## Design decisions

- **Page objects** keep locators and actions in one place, so tests read like user steps and a UI change is fixed once.
- **Login once per run**: a setup project authenticates and saves the session with `storageState`; cart and checkout tests reuse it and start directly on the inventory page. Login tests clear the state so they still exercise the real login form.
- **Separate API project** with its own `baseURL`, no browser and no session, so API tests run once and fast.
- **Readable API flows** with `test.step`, so the report shows each phase of the booking lifecycle.
- **Tags** split a fast smoke suite from the full regression suite.
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
npx playwright test                     # everything
npx playwright test --project=chromium  # one browser
npx playwright test --project=api       # API tests only
npx playwright test --grep "@smoke"     # smoke suite
npx playwright test --grep "@regression" # regression suite
npx playwright test --ui                # interactive UI mode
npx playwright show-report              # open the HTML report
```

## CI

GitHub Actions runs the suite on Chromium, Firefox and WebKit plus the API project:

- **Push / pull request** to `main`: smoke suite
- **Nightly** at 06:00 (Bucharest): full suite
- **Manual run** (`workflow_dispatch`): choose smoke, regression or all from a dropdown

After every run the HTML report is deployed to [GitHub Pages](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/) and also kept as a build artifact. Credentials come from repository secrets `SAUCE_USERNAME` and `SAUCE_PASSWORD`.

## Roadmap

- [x] UI tests for login, cart and checkout
- [x] Page Object Model and fixtures
- [x] Session reuse with `storageState`
- [x] CI on three browsers
- [x] API tests for Restful Booker (auth token, CRUD bookings, negative cases)
- [x] `@smoke` / `@regression` tags
- [x] Nightly and manual CI runs
- [x] HTML report published to GitHub Pages
- [ ] Screenshots, videos and traces kept on failure
- [ ] API client class and schema validation
- [ ] Generated test data with Faker
- [ ] Sharding and merged reports

## Author

**Alin Pasalega**, QA Automation Engineer
[LinkedIn](https://www.linkedin.com/in/alin-alexandru-pasalega-341ab7142/)
