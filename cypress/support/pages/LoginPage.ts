// Page Object Model: locators and actions of the login page. A UI change is fixed here, not in every test.
class LoginPage {
  open(): this {
    cy.visit('/');
    this.loginButton().should('be.visible');
    return this;
  }

  logo() {
    return cy.get('.login_logo');
  }
  usernameInput() {
    return cy.getByTestId('username');
  }
  passwordInput() {
    return cy.getByTestId('password');
  }
  loginButton() {
    return cy.getByTestId('login-button');
  }
  errorMessage() {
    return cy.getByTestId('error');
  }
  errorCloseButton() {
    return cy.getByTestId('error-button');
  }

  login(username: string, password: string): this {
    if (username) this.usernameInput().type(username);
    if (password) this.passwordInput().type(password, { log: false });
    this.loginButton().click();
    return this;
  }

  expectError(message: string): this {
    this.errorMessage().should('have.text', message);
    return this;
  }
}

export const loginPage = new LoginPage();
