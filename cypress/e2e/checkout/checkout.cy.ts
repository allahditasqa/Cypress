// Checkout module: the end-to-end purchase. Same test cases as the Playwright repository:
// docs/test-cases/checkout-checkout.md there.
import products from '../../fixtures/products.json';
import { MESSAGES, ROUTE } from '../../support/constants';
import { cartPage } from '../../support/pages/CartPage';
import { checkoutPage } from '../../support/pages/CheckoutPage';
import { inventoryPage } from '../../support/pages/InventoryPage';

const [backpack, bikeLight] = products;

beforeEach(() => {
  cy.loginAsStandardUser();
  inventoryPage.open().addToCart(backpack.name).openCart();
  cartPage.checkout();
});

describe('Checkout - information step', () => {
  it(
    'TC_CHECKOUT_01 - Continue with first name "Ada", last name "Lovelace" and postal code "12345" and check the overview opens',
    { tags: '@smoke' },
    () => {
      checkoutPage.fillInformation('Ada', 'Lovelace', '12345').continue();
      cy.url().should('match', ROUTE.checkoutOverview);
    },
  );

  it(
    'TC_CHECKOUT_02 - Continue with an empty first name and check the "First Name is required" message',
    { tags: '@smoke' },
    () => {
      checkoutPage.fillInformation('', 'Lovelace', '12345').continue();
      checkoutPage.errorMessage().should('have.text', MESSAGES.firstNameRequired);
    },
  );

  it('TC_CHECKOUT_03 - Continue with an empty last name and check the "Last Name is required" message', () => {
    checkoutPage.fillInformation('Ada', '', '12345').continue();
    checkoutPage.errorMessage().should('have.text', MESSAGES.lastNameRequired);
  });

  it('TC_CHECKOUT_04 - Continue with an empty postal code and check the "Postal Code is required" message', () => {
    checkoutPage.fillInformation('Ada', 'Lovelace', '').continue();
    checkoutPage.errorMessage().should('have.text', MESSAGES.postalCodeRequired);
  });

  it('TC_CHECKOUT_05 - Click Cancel on the information step and check the cart opens', () => {
    checkoutPage.cancel();
    cy.url().should('match', ROUTE.cart);
  });
});

describe('Checkout - overview and completion', () => {
  it(
    'TC_CHECKOUT_06 - Finish an order for "Sauce Labs Backpack" and check the "Thank you for your order!" message',
    { tags: '@smoke' },
    () => {
      checkoutPage.fillInformation('Ada', 'Lovelace', '12345').continue().finish();
      cy.url().should('match', ROUTE.checkoutComplete);
      checkoutPage.completeHeader().should('have.text', MESSAGES.orderComplete);
    },
  );

  it('TC_CHECKOUT_07 - On the overview check the item total is $29.99 and the total equals item total plus tax', () => {
    checkoutPage.fillInformation('Ada', 'Lovelace', '12345').continue();
    checkoutPage.subtotal().should('equal', backpack.price);
    checkoutPage.subtotal().then((subtotal) => {
      checkoutPage.tax().then((tax) => {
        checkoutPage.total().should('be.closeTo', subtotal + tax, 0.001);
      });
    });
  });

  it('TC_CHECKOUT_08 - Finish an order and click "Back Home" and check the cart is empty', () => {
    checkoutPage.fillInformation('Ada', 'Lovelace', '12345').continue().finish().backHome();
    cy.url().should('match', ROUTE.inventory);
    inventoryPage.cartBadge().should('not.exist');
  });
});

describe('Checkout - totals with two items', () => {
  it('TC_CHECKOUT_09 - Add "Sauce Labs Bike Light" too and check the item total is the sum of both prices', () => {
    inventoryPage.open().addToCart(bikeLight.name).openCart();
    cartPage.checkout();
    checkoutPage.fillInformation('Ada', 'Lovelace', '12345').continue();
    checkoutPage.subtotal().should('be.closeTo', backpack.price + bikeLight.price, 0.001);
  });
});
