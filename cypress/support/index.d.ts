/// <reference types="cypress" />
/// <reference types="@cypress/grep" />

declare namespace Cypress {
  interface Chainable {
    /** Element with the given data-test attribute. */
    getByTestId(id: string): Chainable<JQuery<HTMLElement>>;
    /** Logs in as the standard user once and caches the session. */
    loginAsStandardUser(): Chainable<void>;
  }
}
