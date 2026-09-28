# Playwright + TypeScript Test Automation Portfolio

End-to-end test automation framework built with Playwright and TypeScript, covering UI and API testing.

🚧 Work in progress: built step by step with AI-assisted development.

## Stack
- Playwright Test + TypeScript
- UI tests: [Sauce Demo](https://www.saucedemo.com/)
- API tests: [Restful Booker](https://restful-booker.herokuapp.com/) (coming soon)
- CI: GitHub Actions

## Run locally
npm install
npx playwright install
npx playwright test          # run all tests
npx playwright test --ui     # interactive UI mode
npx playwright show-report   # open the HTML report

## Roadmap
- [x] Project setup + CI
- [x] Login tests
- [ ] Cart and checkout tests
- [ ] Page Object Model + fixtures
- [ ] API tests (Restful Booker)
- [ ] Tags (@smoke / @regression)
