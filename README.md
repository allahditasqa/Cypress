# Cypress Test Automation Framework (TypeScript)

[![CI](https://github.com/allahditasqa/Cypress/actions/workflows/ci.yml/badge.svg)](https://github.com/allahditasqa/Cypress/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/Cypress-16-17202C?logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tests](https://img.shields.io/badge/tests-47%20(UI%20%2B%20API)-brightgreen)

An end-to-end test automation framework built with **Cypress and TypeScript**: Page Object Model, custom commands,
cached login sessions, tag-based suites, API tests, documented test cases and module-wise HTML/CSV reports named with the run date and time.
The same 47 test cases (same IDs, same titles) also exist in my [Playwright framework](https://github.com/allahditasqa/Playwright),
so the two tools can be compared on identical work.

| Target | URL |
| --- | --- |
| Web shop (UI tests) | https://www.saucedemo.com |
| REST API (API tests) | https://jsonplaceholder.typicode.com |

> **Sibling frameworks:** [Playwright](https://github.com/allahditasqa/Playwright) (web) and [Appium](https://github.com/allahditasqa/Appium) (Android + iOS, Java).

## What this repository demonstrates

- **Layered design:** specs → page objects and components → API layer → constants and fixtures. Specs never contain selectors.
- **Fast tests:** one real login per run (`cy.session`), then every module starts inside the app. The whole suite runs in under a minute.
- **UI and API in one project:** `cy.request` powers the API layer, so both kinds of tests share the same runner and report.
- **Tags:** `@smoke` marks the High priority cases; `npm run test:smoke` runs only those (`@cypress/grep`).
- **A report that explains itself:** test titles are full sentences with the test data, so the report reads like a test case.
- **Quality gates:** strict TypeScript, ESLint with the Cypress plugin, Prettier, and a CI pipeline.

## Tech stack

| Area | Tool |
| --- | --- |
| Test runner | Cypress 16 |
| Language | TypeScript 6 (strict) |
| Pattern | Page Object Model + reusable component + custom commands |
| Tags | `@cypress/grep` |
| Reports | mochawesome (JSON) merged into one self-contained HTML file |
| Lint and format | ESLint 10 + `eslint-plugin-cypress`, Prettier |
| CI | GitHub Actions |

## Architecture

```
cypress/e2e/<module>/<sub>.cy.ts    WHAT to check (steps and assertions only)
        │ uses
cypress/support/commands.ts         cy.getByTestId(), cy.loginAsStandardUser() (cached session)
cypress/support/pages/              HOW to talk to the UI (locators and actions per page)
cypress/support/components/         reusable UI parts (header menu)
cypress/support/api/                HOW to talk to the REST API (PostsApi)
cypress/fixtures/ · support/constants.ts    test data, URL patterns, expected messages
        │ configured by
cypress.config.ts                   base URL, timeouts, reporters, tags, public values (Cypress.expose)
scripts/run.js · scripts/report.js  run Cypress, then build the dated HTML report
```

### Design decisions (and why)

| Decision | Why |
| --- | --- |
| `cy.session` for login | The login UI is tested by the login specs; every other spec reuses a cached session instead of logging in again |
| `cy.getByTestId()` custom command | The demo app has `data-test` attributes; one command keeps selectors uniform and short |
| Chainable page objects (`inventoryPage.sortBy('az').productNames()`) | Tests read like sentences and stay free of selectors |
| No `cy.wait(ms)` for synchronisation | Cypress retries assertions until they pass; a fixed sleep only slows the suite down |
| Retries off locally, 1 on CI | A flaky test must be visible on a developer machine |
| Deep links such as `/inventory.html` are visited with `failOnStatusCode: false` | The demo host answers them with HTTP 404 although the app renders; documented in `InventoryPage` |
| Public values in `Cypress.expose()`, secrets (if any) in `cy.env()` | Cypress 16 keeps secrets out of the browser-visible config |

## Project structure

```
.
├── cypress/
│   ├── e2e/                 auth · inventory · cart · checkout · api
│   ├── fixtures/            products.json
│   └── support/             commands, constants, pages/, components/, api/
├── docs/                    TEST_STRATEGY, TEST_CASE_STANDARD, test-cases/ (.md + master CSV)
├── reports/                 committed module-wise reports (index.html, history.json, <module>/)
├── scripts/                 run.js, report.js (module-wise reports), export-test-cases.js, lib/
├── cypress.config.ts
├── eslint.config.mjs · .prettierrc.json · tsconfig.json
└── .github/workflows/ci.yml
```

## Test coverage

| Module | Test cases | Type |
| --- | --- | --- |
| Auth: Login | 15 | UI: valid and invalid login, validation messages, SQL text, access without login |
| Inventory: Products | 10 | UI: list, four sort orders, cart badge, product details |
| Cart | 5 | UI: add, remove, continue shopping, start checkout |
| Checkout | 9 | UI end to end: required fields, order completion, totals = item total + tax |
| API: Posts | 8 | REST: status codes, response shape, filtering, create, update, delete, unknown id |
| **Total** | **47** | 20 are tagged `@smoke` |

The test case documents (steps and expected results) are in `docs/test-cases`.

## Getting started

**Prerequisites:** Node.js 20 or newer.

```bash
git clone https://github.com/allahditasqa/Cypress.git
cd Cypress
npm install
npm test
```

| Goal | Command |
| --- | --- |
| Run everything and build the report | `npm test` |
| Open the interactive runner | `npm run cy:open` |
| Only the High priority cases | `npm run test:smoke` |
| One module | `npm run test:auth` · `test:inventory` · `test:cart` · `test:checkout` · `test:api` |
| Rebuild the report from the last run | `npm run report` |
| All quality gates (incl. test case traceability) | `npm run check` |

## Test cases

The 47 cases are documented in this repository in one standard format: [docs/TEST_CASE_STANDARD.md](docs/TEST_CASE_STANDARD.md), [docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md).

| Item | Where |
| --- | --- |
| Test case documents (5, one per module) | [`docs/test-cases/*.md`](docs/test-cases) |
| Master CSV (same columns for every module) | `docs/test-cases/*.csv` |
| Cases | **47**: 20 High, 21 Medium, 6 Low; all automated |

Each case has an ID (`TC_<MODULE>_<NN>`, the same ID is in the `it()` title and in the Playwright repository), module and sub-module, title,
priority, type, preconditions, test data, numbered steps, expected result, automation status, spec file and the requirement it traces to.
`npm run cases:check` proves documents and code agree 1:1 (IDs, titles, spec files, master CSV); it runs in CI.

## Reports

`npm test` runs Cypress and then [`scripts/report.js`](scripts/report.js) turns the mochawesome JSON into module-wise, self-contained reports.
They are **committed**; every run adds new files and an old report is never overwritten:

```
reports/
├── index.html                                              history of all runs, newest on top, links to every module report
├── history.json
└── auth/
    ├── Auth test 18-11-2026_14-27-33.html                  HTML report of the module (failure screenshots embedded)
    └── Auth test cases 18-11-2026_14-27-33.csv             the cases of the module: steps, expected result and the real result of this run
    (the same for inventory/, cart/, checkout/, api/)
```

| Goal | Command |
| --- | --- |
| Run and generate the reports | `npm test` |
| Rebuild the reports from the last run | `npm run report` (writes new files) |
| Open the history | `npm run reports` |

**Latest committed run: 18-11-2026 14:27:33, Electron (47 of 47 passed).** Open [reports/index.html](reports/index.html) or a module report, for example
[Auth](reports/auth), [Inventory](reports/inventory), [Cart](reports/cart), [Checkout](reports/checkout), [API](reports/api).

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request:

1. **Quality gates:** type check, lint, format check.
2. **UI + API tests** on a clean Linux runner; the report and screenshots are uploaded as an artifact.

## Playwright and Cypress on the same test cases

| Topic | Cypress (this repo) | Playwright |
| --- | --- | --- |
| Test cases | 47, same IDs and titles | 47 |
| Login reuse | `cy.session` | `storageState` in a setup project |
| Selectors | `cy.getByTestId()` command | `getByTestId` built in |
| API tests | `cy.request` | `request` fixture |
| Parallel runs | per spec file, needs Cypress Cloud or a CI matrix | built in (workers) |
| Browsers | Chromium family, Firefox | Chromium, Firefox, WebKit |
| Reports | mochawesome JSON -> module-wise HTML + CSV | custom reporter -> same module-wise HTML + CSV |

## Roadmap

- Run in parallel with a CI matrix
- Visual comparison for the products page
- Accessibility checks with `cypress-axe`
