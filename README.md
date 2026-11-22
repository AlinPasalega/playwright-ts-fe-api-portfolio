# Playwright + TypeScript — UI & API Test Automation Portfolio

[![Playwright Tests](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlinPasalega/playwright-ts-fe-api-portfolio/actions/workflows/playwright.yml)
[![Allure report](https://img.shields.io/badge/Allure-live%20report-orange)](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/)

Playwright · TypeScript · Zod · Allure · GitHub Actions

End-to-end test automation framework built with **Playwright** and **TypeScript**, covering UI flows on [Sauce Demo](https://www.saucedemo.com) and REST API tests on [Restful Booker](https://restful-booker.herokuapp.com).

📊 **[Latest Allure report](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/)**, published automatically after every CI run.

## Highlights

- 🤖 **AI CI failure triage (xAI Grok API)**: when tests fail in CI, Grok classifies each failure (product bug, test bug, flaky or environment) and suggests a fix, right in the GitHub job summary. The triage step never fails the build.
- 🧪 **AI-generated edge-case test data**: Grok generates unusual but valid bookings (unicode/emoji names, long strings, price `0`, leap-day dates), validated with **Zod** (and extra value checks) before any test uses them, and exercised by the `@ai` API test on nightly CI.
- 🛠️ **Built with Grok Bot AI assistants**: developed in a pair-programming and coaching workflow with Grok Bot for scaffolding, debugging flaky tests and CI setup.
- ⚡ **Sharded CI** on Chromium, Firefox, WebKit and API, with a merged job summary and a live **Allure** report with history.

## Tech stack

- Playwright Test + TypeScript
- Page Object Model and custom fixtures (`test.extend`)
- Authenticated sessions with `storageState`
- API client over Playwright's `request` fixture
- Zod schema validation and Faker test data
- Data-driven tests with `@smoke` / `@regression` / `@ai` tags
- ESLint, Prettier, Husky and lint-staged
- GitHub Actions (sharded, nightly and on-demand) with Allure on GitHub Pages

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
- Network mocking: the store still works when product images fail to load (`page.route()`)

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

**API: AI-generated edge cases (`@ai`)**

- `creates and reads back AI-generated bookings`: Grok generates unusual but valid bookings, each one is created, read back, checked against the Zod schemas and deleted
- Skips itself when `XAI_API_KEY` is not set; runs in the nightly CI suite when the key is present

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
scripts/
  ai-failure-summary.mts           # Grok triage of failed tests -> job summary
utils/
  aiTestData.ts                    # Grok edge-case booking generator + Zod validation
tests/
  auth.setup.ts                    # Logs in once and saves the session
  fixtures.ts                      # loggedInPage fixture
  bookingFixtures.ts               # API client, token and booking cleanup
  ui/
    login.spec.ts
    inventory.spec.ts
    cart.spec.ts
    checkout-validation.spec.ts
  api/
    auth.spec.ts
    booking.spec.ts                # incl. @ai AI-generated edge cases
    booking-negative.spec.ts
playwright.config.ts
tsconfig.json
allurerc.mjs                       # Allure config + history
eslint.config.mjs
.prettierrc
.env.example
```

## Design decisions

- **Page objects and an API client** keep locators, endpoints and actions in one place. Tests only describe the steps and hold all the assertions, so a UI or API change is fixed once.
- **Login once per run**: a setup project authenticates and saves the session with `storageState`; inventory, cart and checkout tests reuse it. Login tests clear the state so they still exercise the real login form.
- **Separate API project** with its own `baseURL`, no browser and no session, so API tests run once and fast.
- **Data-driven tests** loop over case tables (sort options, checkout errors), so adding a case is one line.
- **Schema validation with Zod** catches contract changes (missing fields, wrong types and invalid dates), not just wrong values.
- **Fresh Faker data per test** keeps tests independent on a shared public API; each test deletes what it created.
- **Web-first assertions instead of fixed waits**: locators are returned from page objects and checked with auto-retrying `expect`. Flaky WebKit behaviour on the burger menu was fixed by waiting for the menu's real open state (`aria-hidden="false"`) and then clicking the logout link, not by adding timeouts or bypassing actionability checks.
- **Readable reports** with `test.step`, so each phase of a flow shows up separately.
- **Tags** split a fast smoke suite from the full regression suite.
- **Stable locators** via `data-test` attributes (`testIdAttribute: 'data-test'`).
- **No hardcoded credentials**: values come from `.env` locally and GitHub secrets in CI.
- **AI output is never trusted blindly**: everything Grok generates is parsed with Zod before a test uses it, and the AI triage step can never fail the build.
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
XAI_API_KEY=           # optional, needed for the @ai tests
XAI_MODEL=grok-4.3
```

## Running tests

```bash
npm test                             # everything
npx playwright test --project=chromium   # one browser
npm run test:api                     # API tests only
npm run test:smoke                   # smoke suite
npx playwright test --grep "@regression" # regression suite
npx playwright test --grep "@ai"     # AI-generated edge cases (needs XAI_API_KEY)
npx playwright test --ui             # interactive UI mode
npx playwright show-report           # open the HTML report
npm run lint                         # ESLint
npm run format                       # Prettier
```

## CI

GitHub Actions runs the suite on Chromium, Firefox and WebKit plus the API project:

- **Push / pull request** to `main`: smoke suite
- **Nightly** at 06:00 (Bucharest): full suite, including `@ai` when `XAI_API_KEY` is set
- **Manual run** (`workflow_dispatch`): choose smoke, regression or all from a dropdown

After every run an Allure report (with history across runs) is deployed to [GitHub Pages](https://alinpasalega.github.io/playwright-ts-fe-api-portfolio/) and also kept as a build artifact. Screenshots, videos and traces from failed tests are uploaded as artifacts. Credentials come from repository secrets `SAUCE_USERNAME` and `SAUCE_PASSWORD`.

### Sharding and merged reports

- Tests run in a **2-shard matrix** (`--shard=1/2`, `--shard=2/2`) in parallel.
- Each shard uploads a **blob report** and its **Allure results** as artifacts.
- A `merge-reports` job downloads them, merges the blob reports with `npx playwright merge-reports` into a JSON file for the job summary, merges the Allure results, and deploys the Allure report (with history) to GitHub Pages.

## AI-assisted testing (xAI Grok)

### CI failure triage

`scripts/ai-failure-summary.mts` runs in the `merge-reports` job:

1. Reads the merged `results.json` and collects the failed tests and their errors.
2. Sends them to the xAI Grok API (`https://api.x.ai/v1/chat/completions`). The model comes from the `XAI_MODEL` repository variable (falling back to `grok-4.3`) and the key from the `XAI_API_KEY` secret.
3. Writes a triage section to the GitHub job summary: for each failure, the likely cause (**product bug**, **test bug**, **flaky** or **environment**) and a suggested fix.

The step **never fails the build**: if there are no failures, no key, no results file, or the API call throws, it just notes that in the summary and exits 0.

### AI-generated edge-case test data

`utils/aiTestData.ts` exports `generateEdgeCaseBookings()`, which asks Grok for unusual but valid booking payloads: unicode, emoji and CJK names, very long strings, apostrophes and hyphens, price `0`, leap-day dates. The response is **validated with Zod before any test uses it**, so bad AI output fails loudly instead of producing junk data.

The test `creates and reads back AI-generated bookings` (tag `@ai`, in `tests/api/booking.spec.ts`) creates, reads back and deletes each booking. It skips itself when `XAI_API_KEY` is not set, so the rest of the suite runs without a key. In CI, the key is passed into the test job so the nightly (and manual "all") runs can execute this test.

Run it locally (PowerShell):

```powershell
$env:XAI_API_KEY="..."; $env:XAI_MODEL="grok-4.3"; npx playwright test --grep "@ai"
```

Never commit the key: use an environment variable locally and the `XAI_API_KEY` secret in CI.

## Built with Grok Bot

This framework was built with **Grok Bot** AI assistants in a pair-programming and coaching workflow: scaffolding the framework, debugging flaky tests and setting up the sharded CI pipeline. I review every change before it goes in.

## What's next

- Keep demo credentials in environment variables only (login tests and the Restful Booker client still use the public demo values in a few places)
- Add a LICENSE file to match the package license

## Author

**Alin Pasalega**, QA Automation Engineer
[LinkedIn](https://www.linkedin.com/in/alin-alexandru-pasalega-341ab7142/)
