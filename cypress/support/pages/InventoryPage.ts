import { slug, toMoney } from '../constants';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

class InventoryPage {
  open(): this {
    // The demo host answers deep links such as /inventory.html with HTTP 404 although the app renders, so a 404 must not fail the visit.
    cy.visit('/inventory.html', { failOnStatusCode: false });
    this.title().should('have.text', 'Products');
    return this;
  }

  title() {
    return cy.getByTestId('title');
  }
  items() {
    return cy.getByTestId('inventory-item');
  }
  cartBadge() {
    return cy.getByTestId('shopping-cart-badge');
  }

  /** Names of the products in the order they are shown. */
  productNames(): Cypress.Chainable<string[]> {
    return cy.getByTestId('inventory-item-name').then(($els) => [...$els].map((el) => el.innerText));
  }

  /** Prices of the products in the order they are shown. */
  productPrices(): Cypress.Chainable<number[]> {
    return cy.getByTestId('inventory-item-price').then(($els) => [...$els].map((el) => toMoney(el.innerText)));
  }

  sortBy(option: SortOption): this {
    cy.getByTestId('product-sort-container').select(option);
    return this;
  }

  addToCart(productName: string): this {
    cy.getByTestId(`add-to-cart-${slug(productName)}`).click();
    return this;
  }

  removeFromCart(productName: string): this {
    cy.getByTestId(`remove-${slug(productName)}`).click();
    return this;
  }

  openCart(): this {
    cy.getByTestId('shopping-cart-link').click();
    return this;
  }

  openProduct(productName: string): this {
    cy.getByTestId('inventory-item-name').contains(productName).click();
    return this;
  }
}

export const inventoryPage = new InventoryPage();
