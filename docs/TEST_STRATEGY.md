# Test strategy: Swag Labs demo shop and JSONPlaceholder API (Cypress)

**Version:** 1.0  |  **Prepared by:** QA (SDET)

## 1. Objective
Automate the same 47 test cases as the [Playwright framework](https://github.com/allahditasqa/Playwright) with Cypress, so both tools can be compared on identical work. Case IDs, titles and documents are the same.

## 2. Applications under test

| Application | URL | Purpose |
| --- | --- | --- |
| Swag Labs (Sauce Demo) | https://www.saucedemo.com | Web shop UI: login, products, cart, checkout |
| JSONPlaceholder | https://jsonplaceholder.typicode.com | Fake REST API: posts and comments |

## 3. Scope

| Module | Sub-module | Test cases | Type |
| --- | --- | --- | --- |
| Auth | Login | 15 | UI |
| Inventory | Products | 10 | UI |
| Cart | Cart | 5 | UI |
| Checkout | Checkout | 9 | UI, end to end |
| API | Posts | 8 | API |

**Out of scope:** the misbehaving demo users (`problem_user`, `performance_glitch_user`), visual regression, load testing, accessibility audits, mobile browsers.

## 4. Approach
Functional positive and negative cases, validation, business rules (sorting, badge, totals), security basics (SQL text, protected page) and API status/shape checks. Page Object Model, `cy.session` for login, tags (`@smoke` = High priority). Exploratory and usability testing is manual.

## 5. Environment and data
Cypress 16, Electron (default) or Chrome, 1440 x 900. Public demo users; the cart lives in the browser and the API fakes writes, so nothing needs cleaning up.

## 6. Entry and exit criteria
All High cases pass, pass rate 95% or more, no open Critical or High defect.

## 7. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Public demo services slow or changed | Failing tests that are not product bugs | Messages and prices in constants/fixtures; 1 retry on CI only |
| Shared public API | Rate limits or downtime | Small independent API tests |

## 8. Deliverables
Test case documents and master CSV (`docs/test-cases`), automation code, module-wise reports committed in `reports/`, CI pipeline.

## 9. Requirements (the traceability targets)
The demo applications have no written specification, so the requirements below are derived from the visible behaviour of the application.
Every test case names one of them in its Traceability table. API cases name the section of the JSONPlaceholder guide.

| ID | Requirement | Test cases |
| --- | --- | --- |
| REQ-AUTH-01 | The login page shows the logo, both fields and the Login button; the password is hidden | TC_LOGIN_01, 02 |
| REQ-AUTH-02 | A valid user can log in (button or Enter) and the products page opens | TC_LOGIN_03, 04 |
| REQ-AUTH-03 | The session stays after a reload; Logout returns to the login page | TC_LOGIN_05, 06 |
| REQ-AUTH-04 | A locked-out user cannot log in and sees a clear message | TC_LOGIN_07 |
| REQ-AUTH-05 | Wrong, unknown, wrongly-cased or malicious credentials are rejected with a message | TC_LOGIN_08, 09, 12, 13 |
| REQ-AUTH-06 | An empty username or password shows a validation message | TC_LOGIN_10, 11 |
| REQ-AUTH-07 | The error message can be closed | TC_LOGIN_14 |
| REQ-AUTH-08 | Protected pages need a login | TC_LOGIN_15 |
| REQ-INV-01 | The products page lists the products with name and price | TC_PRODUCTS_01 |
| REQ-INV-02 | The list can be sorted by name and by price, in both directions | TC_PRODUCTS_02 to 05 |
| REQ-INV-03 | The cart badge shows the number of items | TC_PRODUCTS_06 to 08 |
| REQ-INV-04 | A product has a details page with a way back | TC_PRODUCTS_09, 10 |
| REQ-CART-01 | Added products are listed in the cart | TC_CART_01, 02 |
| REQ-CART-02 | Products can be removed from the cart | TC_CART_03 |
| REQ-CART-03 | From the cart the user can continue shopping or start the checkout | TC_CART_04, 05 |
| REQ-CHK-01 | The checkout asks for first name, last name and postal code and validates them | TC_CHECKOUT_01 to 05 |
| REQ-CHK-02 | An order can be finished and the cart is empty afterwards | TC_CHECKOUT_06, 08 |
| REQ-CHK-03 | The overview totals are correct (item total + tax) | TC_CHECKOUT_07, 09 |

## 10. Reports
Module-wise reports are written after every run and committed to the repository: `reports/index.html`, `reports/history.json` and, per module,
`reports/<module-slug>/<Module Name> test <DD-MM-YYYY>_<HH-mm-ss>.html` plus the matching `... test cases ...csv` with the real result of each case.
