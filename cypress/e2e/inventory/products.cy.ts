// Inventory (products) module. Same test cases as the Playwright repository: docs/test-cases/inventory-products.md there.
import products from '../../fixtures/products.json';
import { ROUTE } from '../../support/constants';
import { inventoryPage } from '../../support/pages/InventoryPage';
import { productDetailsPage } from '../../support/pages/ProductDetailsPage';

const [backpack, bikeLight] = products;

beforeEach(() => {
  cy.loginAsStandardUser();
  inventoryPage.open();
});

describe('Products - list', () => {
  it(
    'TC_PRODUCTS_01 - Open the products page and check 6 products are shown with the expected names and prices',
    { tags: '@smoke' },
    () => {
      inventoryPage.items().should('have.length', products.length);
      inventoryPage.productNames().then((names) => {
        expect([...names].sort()).to.deep.equal(products.map((p) => p.name).sort());
      });
      inventoryPage.productPrices().then((prices) => {
        expect([...prices].sort((a, b) => a - b)).to.deep.equal(products.map((p) => p.price).sort((a, b) => a - b));
      });
    },
  );
});

describe('Products - sorting', () => {
  it('TC_PRODUCTS_02 - Sort by "Name (A to Z)" and check the names are in ascending order', { tags: '@smoke' }, () => {
    inventoryPage
      .sortBy('az')
      .productNames()
      .then((names) => {
        expect(names).to.deep.equal([...names].sort());
      });
  });

  it('TC_PRODUCTS_03 - Sort by "Name (Z to A)" and check the names are in descending order', () => {
    inventoryPage
      .sortBy('za')
      .productNames()
      .then((names) => {
        expect(names).to.deep.equal([...names].sort().reverse());
      });
  });

  it(
    'TC_PRODUCTS_04 - Sort by "Price (low to high)" and check the prices are in ascending order',
    { tags: '@smoke' },
    () => {
      inventoryPage
        .sortBy('lohi')
        .productPrices()
        .then((prices) => {
          expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
        });
    },
  );

  it('TC_PRODUCTS_05 - Sort by "Price (high to low)" and check the prices are in descending order', () => {
    inventoryPage
      .sortBy('hilo')
      .productPrices()
      .then((prices) => {
        expect(prices).to.deep.equal([...prices].sort((a, b) => b - a));
      });
  });
});

describe('Products - cart badge', () => {
  it(
    'TC_PRODUCTS_06 - Add "Sauce Labs Backpack" to the cart and check the cart badge shows 1',
    { tags: '@smoke' },
    () => {
      inventoryPage.addToCart(backpack.name);
      inventoryPage.cartBadge().should('have.text', '1');
    },
  );

  it('TC_PRODUCTS_07 - Add "Sauce Labs Backpack" and "Sauce Labs Bike Light" and check the cart badge shows 2', () => {
    inventoryPage.addToCart(backpack.name).addToCart(bikeLight.name);
    inventoryPage.cartBadge().should('have.text', '2');
  });

  it('TC_PRODUCTS_08 - Add "Sauce Labs Backpack" and remove it again and check the cart badge disappears', () => {
    inventoryPage.addToCart(backpack.name).removeFromCart(backpack.name);
    inventoryPage.cartBadge().should('not.exist');
  });
});

describe('Products - details', () => {
  it('TC_PRODUCTS_09 - Open "Sauce Labs Backpack" and check its details page shows the name and price $29.99', () => {
    inventoryPage.openProduct(backpack.name);
    cy.url().should('match', ROUTE.inventoryItem);
    productDetailsPage.name().should('have.text', backpack.name);
    productDetailsPage.price().should('have.text', '$29.99');
  });

  it('TC_PRODUCTS_10 - Open a product and click "Back to products" and check the products page opens', () => {
    inventoryPage.openProduct(bikeLight.name);
    productDetailsPage.backButton().click();
    cy.url().should('match', ROUTE.inventory);
  });
});
