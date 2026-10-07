# Playwright + TypeScript — UI & API Test Automation Portfolio

[![Playwright Tests](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml)

📊 **[Latest test report](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/)**, published automatically after every CI run.

End-to-end test automation framework built with **Playwright** and **TypeScript**, covering UI flows on [Sauce Demo](https://www.saucedemo.com) and REST API tests on [Restful Booker](https://restful-booker.herokuapp.com).

## Tech stack

- Playwright Test + TypeScript
- Page Object Model
- Custom fixtures (`test.extend`)
- Authenticated sessions with `storageState` (setup project)
- API client class wrapping Playwright's `request` fixture
- Contract / schema validation with **Zod**
- Generated test data with **Faker**
- Data-driven (parametrized) tests
- `@smoke` / `@regression` tags
- Environment config with `dotenv`
- ESLint + Prettier, enforced on every commit with Husky + lint-staged
- GitHub Actions CI on Chromium, Firefox and WebKit, with nightly and on-demand runs
- HTML report published to GitHub Pages; screenshots, videos and traces kept on failure

## What's covered

**UI: Login**

- Standard user logs in and lands on Products
- Locked-out user sees an error
- Wrong password shows a validation error

**UI: Inventory**

- Data-driven sorting: all four options (name A–Z, Z–A, price low–high, high–low), checking the real order of names and prices
- Cart badge updates when products are added and removed
- Product detail page shows the same name and price as the inventory list
- Logout through the burger menu

**UI: Cart & checkout**

- Add one item and check the cart badge
- Add multiple items and check the badge count
- Remove an item and check the badge disappears
- Full checkout happy path to the order confirmation page
- Data-driven form validation: missing first name, last name or postal code each show the correct error

**API: Authentication**

- Valid credentials return a token
- Invalid credentials return no token and a "Bad credentials" reason

**API: Bookings**

- Full lifecycle in one test with `test.step`: authenticate, create, read, update (PUT), delete, confirm deletion (404)
- Partial update (PATCH): changed fields update, untouched fields stay the same
- Filter bookings by first and last name and find the newly created booking
- Response bodies validated against Zod schemas
- Negative cases: update and delete without a token return 403, a booking that doesn't exist returns 404
- Every test creates its own Faker data and cleans up after itself

## Project structure

```
.github/workflows/playwright.yml   # CI pipeline + GitHub Pages report
.husky/pre-commit                  # Runs lint-staged before every commit
api/
  BookingClient.ts                 # API client: endpoints, auth token, requests
  schemas.ts                       # Zod schemas for booking responses
  testData.ts                      # Faker test data builders
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
    inventory.spec.ts
    cart.spec.ts
    checkout-validation.spec.ts
  api/
    auth.spec.ts
    booking.spec.ts
    booking-negative.spec.ts
playwright.config.ts
eslint.config.mjs
.prettierrc
.env.example
```

## Design decisions

- **Page objects and an API client** keep locators, endpoints and actions in one place. Tests only describe the steps and hold all the assertions, so a UI or API change is fixed once.
- **Login once per run**: a setup project authenticates and saves the session with `storageState`; inventory, cart and checkout tests reuse it. Login tests clear the state so they still exercise the real login form.
- **Separate API project** with its own `baseURL`, no browser and no session, so API tests run once and fast.
- **Data-driven tests** loop over case tables (sort options, checkout errors), so adding a case is one line.
- **Schema validation with Zod** catches contract changes (missing fields, wrong types), not just wrong values.
- **Fresh Faker data per test** keeps tests independent on a shared public API; each test deletes what it created.
- **Web-first assertions instead of fixed waits**: locators are returned from page objects and checked with auto-retrying `expect`. Flaky WebKit behaviour on the burger menu was fixed by waiting for the menu's real open state (`aria-hidden="false"`), not by adding timeouts.
- **Readable reports** with `test.step`, so each phase of a flow shows up separately.
- **Tags** split a fast smoke suite from the full regression suite.
- **Stable locators** via `data-test` attributes (`testIdAttribute: 'data-test'`).
- **No hardcoded credentials**: values come from `.env` locally and GitHub secrets in CI.
- **Code quality gate**: ESLint and Prettier run automatically on staged files before every commit.

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
npx playwright test                      # everything
npx playwright test --project=chromium   # one browser
npx playwright test --project=api        # API tests only
npx playwright test --grep "@smoke"      # smoke suite
npx playwright test --grep "@regression" # regression suite
npx playwright test --ui                 # interactive UI mode
npx playwright show-report               # open the HTML report
npm run lint                             # ESLint
npm run format                           # Prettier
```

## CI

GitHub Actions runs the suite on Chromium, Firefox and WebKit plus the API project:

- **Push / pull request** to `main`: smoke suite
- **Nightly** at 06:00 (Bucharest): full suite
- **Manual run** (`workflow_dispatch`): choose smoke, regression or all from a dropdown

After every run the HTML report is deployed to [GitHub Pages](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/) and also kept as a build artifact. Screenshots, videos and traces from failed tests are uploaded as artifacts. Credentials come from repository secrets `SAUCE_USERNAME` and `SAUCE_PASSWORD`.

## Roadmap

- [x] UI tests for login, inventory, cart and checkout
- [x] Page Object Model and fixtures
- [x] Session reuse with `storageState`
- [x] CI on three browsers
- [x] API tests for Restful Booker (auth, CRUD, PATCH, filtering, negative cases)
- [x] `@smoke` / `@regression` tags
- [x] Nightly and manual CI runs
- [x] HTML report published to GitHub Pages
- [x] Screenshots, videos and traces kept on failure
- [x] API client class and Zod schema validation
- [x] Generated test data with Faker
- [x] Data-driven UI tests
- [x] ESLint + Prettier + Husky pre-commit checks
- [ ] Sharding and merged reports
- [ ] Allure reporting

## Author

**Alin Pasalega**, QA Automation Engineer
[LinkedIn](https://www.linkedin.com/in/alin-alexandru-pasalega-341ab7142/)
