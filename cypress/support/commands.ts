// Custom commands: small reusable building blocks.
import { password, USERS } from './constants';

// cy.getByTestId('login-button') -> the element with data-test="login-button"
Cypress.Commands.add('getByTestId', (id: string) => cy.get(`[data-test="${id}"]`));

// Logs in as the standard user ONCE and caches the session (cy.session), so the next tests start inside the app.
// The real login UI is covered by the login tests; everything else reuses this session.
Cypress.Commands.add('loginAsStandardUser', () => {
  cy.session(
    USERS.standard,
    () => {
      cy.visit('/');
      cy.getByTestId('username').type(USERS.standard);
      cy.getByTestId('password').type(password(), { log: false });
      cy.getByTestId('login-button').click();
      cy.url().should('include', '/inventory.html');
    },
    { cacheAcrossSpecs: true },
  );
});
