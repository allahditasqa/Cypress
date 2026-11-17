// Cart module. Same test cases as the Playwright repository: docs/test-cases/cart-cart.md there.
import products from '../../fixtures/products.json';
import { ROUTE } from '../../support/constants';
import { cartPage } from '../../support/pages/CartPage';
import { inventoryPage } from '../../support/pages/InventoryPage';

const [backpack, bikeLight] = products;

beforeEach(() => {
  cy.loginAsStandardUser();
  inventoryPage.open();
});

describe('Cart', () => {
  it(
    'TC_CART_01 - Add "Sauce Labs Backpack" and open the cart and check the backpack is listed once',
    { tags: '@smoke' },
    () => {
      inventoryPage.addToCart(backpack.name).openCart();
      cy.url().should('match', ROUTE.cart);
      cartPage.itemNames().should('deep.equal', [backpack.name]);
    },
  );

  it('TC_CART_02 - Add "Sauce Labs Backpack" and "Sauce Labs Bike Light" and check both are listed in the cart', () => {
    inventoryPage.addToCart(backpack.name).addToCart(bikeLight.name).openCart();
    cartPage.itemNames().then((names) => {
      expect([...names].sort()).to.deep.equal([backpack.name, bikeLight.name].sort());
    });
  });

  it('TC_CART_03 - Remove "Sauce Labs Backpack" inside the cart and check the cart is empty', () => {
    inventoryPage.addToCart(backpack.name).openCart();
    cartPage.remove(backpack.name);
    cartPage.items().should('have.length', 0);
    inventoryPage.cartBadge().should('not.exist');
  });

  it('TC_CART_04 - Click "Continue Shopping" in the cart and check the products page opens', () => {
    inventoryPage.openCart();
    cartPage.continueShopping();
    cy.url().should('match', ROUTE.inventory);
  });

  it(
    'TC_CART_05 - Click "Checkout" in the cart and check the "Your Information" step opens',
    { tags: '@smoke' },
    () => {
      inventoryPage.addToCart(backpack.name).openCart();
      cartPage.checkout();
      cy.url().should('match', ROUTE.checkoutInfo);
    },
  );
});
