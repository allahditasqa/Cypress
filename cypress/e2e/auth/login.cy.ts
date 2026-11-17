// Login module. Same test cases (IDs and titles) as the Playwright repository: docs/test-cases/auth-login.md there.
// Tags: @smoke marks the High priority cases (npm run test:smoke).
import { MESSAGES, password, ROUTE, USERS } from '../../support/constants';
import { headerMenu } from '../../support/components/HeaderMenu';
import { inventoryPage } from '../../support/pages/InventoryPage';
import { loginPage } from '../../support/pages/LoginPage';

beforeEach(() => {
  loginPage.open();
});

describe('Login - page', () => {
  it(
    'TC_LOGIN_01 - Check the logo, username, password and Login button are visible on the login page',
    { tags: '@smoke' },
    () => {
      loginPage.logo().should('be.visible');
      loginPage.usernameInput().should('be.visible');
      loginPage.passwordInput().should('be.visible');
      loginPage.loginButton().should('be.enabled');
    },
  );

  it('TC_LOGIN_02 - Check the password field hides the typed text', () => {
    loginPage.passwordInput().type('secret').should('have.attr', 'type', 'password');
  });
});

describe('Login - positive', () => {
  it(
    'TC_LOGIN_03 - Login with username "standard_user" and the correct password by clicking Login',
    { tags: '@smoke' },
    () => {
      loginPage.login(USERS.standard, password());
      cy.url().should('match', ROUTE.inventory);
      inventoryPage.title().should('have.text', 'Products');
    },
  );

  it('TC_LOGIN_04 - Login with username "standard_user" and the correct password by pressing Enter', () => {
    loginPage.usernameInput().type(USERS.standard);
    loginPage.passwordInput().type(`${password()}{enter}`, { log: false });
    cy.url().should('match', ROUTE.inventory);
  });

  it('TC_LOGIN_05 - Login with username "standard_user", then reload the page and stay logged in', () => {
    loginPage.login(USERS.standard, password());
    cy.url().should('match', ROUTE.inventory);
    cy.reload();
    inventoryPage.title().should('have.text', 'Products');
  });

  it(
    'TC_LOGIN_06 - Login with username "standard_user", then log out from the menu and check the login page opens',
    { tags: '@smoke' },
    () => {
      loginPage.login(USERS.standard, password());
      cy.url().should('match', ROUTE.inventory);
      headerMenu.logout();
      cy.url().should('match', ROUTE.login);
      loginPage.loginButton().should('be.visible');
    },
  );
});

describe('Login - negative', () => {
  it(
    'TC_LOGIN_07 - Login with the locked-out user "locked_out_user" and check the locked out message',
    { tags: '@smoke' },
    () => {
      loginPage.login(USERS.lockedOut, password());
      loginPage.expectError(MESSAGES.lockedOut);
      cy.url().should('match', ROUTE.login);
    },
  );

  it(
    'TC_LOGIN_08 - Login with username "standard_user" and the wrong password "wrong_password"',
    { tags: '@smoke' },
    () => {
      loginPage.login(USERS.standard, 'wrong_password');
      loginPage.expectError(MESSAGES.badCredentials);
      cy.url().should('match', ROUTE.login);
    },
  );

  it('TC_LOGIN_09 - Login with the unknown username "unknown_user" and a password', () => {
    loginPage.login('unknown_user', password());
    loginPage.expectError(MESSAGES.badCredentials);
  });

  it('TC_LOGIN_10 - Click Login with empty username and empty password', { tags: '@smoke' }, () => {
    loginPage.loginButton().click();
    loginPage.expectError(MESSAGES.usernameRequired);
  });

  it('TC_LOGIN_11 - Click Login with username "standard_user" and empty password', () => {
    loginPage.usernameInput().type(USERS.standard);
    loginPage.loginButton().click();
    loginPage.expectError(MESSAGES.passwordRequired);
  });

  it('TC_LOGIN_12 - Login with the username in capital letters "STANDARD_USER" (username is case sensitive)', () => {
    loginPage.login(USERS.standard.toUpperCase(), password());
    loginPage.expectError(MESSAGES.badCredentials);
  });

  it("TC_LOGIN_13 - Login with SQL injection text \"' OR '1'='1\" as the username", () => {
    loginPage.login("' OR '1'='1", password());
    loginPage.expectError(MESSAGES.badCredentials);
    cy.url().should('match', ROUTE.login);
  });

  it('TC_LOGIN_14 - Close the error message with the X button and check the message disappears', () => {
    loginPage.loginButton().click();
    loginPage.errorMessage().should('be.visible');
    loginPage.errorCloseButton().click();
    loginPage.errorMessage().should('not.exist');
  });
});

describe('Login - access control', () => {
  it(
    'TC_LOGIN_15 - Open /inventory.html without login and check the "must be logged in" message',
    { tags: '@smoke' },
    () => {
      cy.visit('/inventory.html', { failOnStatusCode: false });
      cy.url().should('match', ROUTE.login);
      loginPage.expectError(MESSAGES.notLoggedIn);
    },
  );
});
