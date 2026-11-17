import { slug } from '../constants';

class CartPage {
  items() {
    return cy.getByTestId('inventory-item');
  }

  itemNames(): Cypress.Chainable<string[]> {
    return cy.getByTestId('inventory-item-name').then(($els) => [...$els].map((el) => el.innerText));
  }

  remove(productName: string): this {
    cy.getByTestId(`remove-${slug(productName)}`).click();
    return this;
  }

  continueShopping(): this {
    cy.getByTestId('continue-shopping').click();
    return this;
  }

  checkout(): this {
    cy.getByTestId('checkout').click();
    return this;
  }
}

export const cartPage = new CartPage();
