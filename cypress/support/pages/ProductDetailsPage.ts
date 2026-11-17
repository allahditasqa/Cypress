/** The details page of one product (opened by clicking a product name). */
class ProductDetailsPage {
  name() {
    return cy.getByTestId('inventory-item-name');
  }
  price() {
    return cy.getByTestId('inventory-item-price');
  }
  backButton() {
    return cy.getByTestId('back-to-products');
  }
}

export const productDetailsPage = new ProductDetailsPage();
