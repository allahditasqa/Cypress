import { toMoney } from '../constants';

/** The three checkout screens: your information, overview, complete. */
class CheckoutPage {
  fillInformation(first: string, last: string, zip: string): this {
    if (first) cy.getByTestId('firstName').type(first);
    if (last) cy.getByTestId('lastName').type(last);
    if (zip) cy.getByTestId('postalCode').type(zip);
    return this;
  }

  continue(): this {
    cy.getByTestId('continue').click();
    return this;
  }
  cancel(): this {
    cy.getByTestId('cancel').click();
    return this;
  }
  finish(): this {
    cy.getByTestId('finish').click();
    return this;
  }
  backHome(): this {
    cy.getByTestId('back-to-products').click();
    return this;
  }

  errorMessage() {
    return cy.getByTestId('error');
  }
  completeHeader() {
    return cy.getByTestId('complete-header');
  }

  subtotal(): Cypress.Chainable<number> {
    return cy.getByTestId('subtotal-label').invoke('text').then(toMoney);
  }
  tax(): Cypress.Chainable<number> {
    return cy.getByTestId('tax-label').invoke('text').then(toMoney);
  }
  total(): Cypress.Chainable<number> {
    return cy.getByTestId('total-label').invoke('text').then(toMoney);
  }
}

export const checkoutPage = new CheckoutPage();
