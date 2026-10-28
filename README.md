# Playwright E2E Tests – Sauce Demo

End-to-end UI test suite for [Sauce Demo](https://www.saucedemo.com), a practice e-commerce site, built with **Playwright** and **TypeScript** using the **Page Object Model**.

## What is covered

20 test cases, run on Chromium and Firefox (40 runs in total).

| Area | What the tests check |
|------|----------------------|
| Login | Valid login, locked-out user, wrong password, empty username/password, direct access to a protected page without logging in |
| Products | Product count, prices are valid, sorting by price (both directions) and by name |
| Cart | Badge count, removing items, cart shows exactly what was added, cart persists after reload |
| Checkout | Full order flow, total = item total + tax, item total = sum of prices, required-field validation (data-driven) |

Tests tagged `@smoke` form a quick check of the most critical paths.

## Project structure

```
pages/        Page objects (Login, Inventory, Cart, Checkout)
tests/        Test specs, one file per feature
test-data/    Users and customer data
.github/      CI workflow (GitHub Actions)
```

## Approach

- **Page Object Model**: selectors and actions live in `pages/`, so tests read like user steps and a UI change only needs fixing in one place.
- **Stable selectors**: uses the site's `data-test` attributes via `getByTestId`, not CSS classes or XPath.
- **Assertions on behaviour, not just presence**: URL changes, exact error messages, sort order, and price calculations.
- **Data-driven tests**: checkout field validation loops over a table of cases.
- **Failure evidence**: screenshots and traces are saved automatically when a test fails.

## Running locally

```bash
npm install
npx playwright install
npm test              # all tests, headless
npm run test:smoke    # smoke tests only
npm run test:headed   # watch the browser
npm run report        # open the HTML report
```

## CI

Every push and pull request to `main` runs the full suite on GitHub Actions. The HTML report is uploaded as a build artifact.
