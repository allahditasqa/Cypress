// Shared constants and helpers used by tests and page objects.

// URL patterns for cy.url().should('match', ...)
export const ROUTE = {
  login: /\/$/,
  inventory: /\/inventory\.html/,
  inventoryItem: /\/inventory-item\.html\?id=\d+/,
  cart: /\/cart\.html/,
  checkoutInfo: /\/checkout-step-one\.html/,
  checkoutOverview: /\/checkout-step-two\.html/,
  checkoutComplete: /\/checkout-complete\.html/,
};

// "$29.99" -> 29.99
export const toMoney = (text: string): number => Number(text.replace(/[^0-9.]/g, ''));

// "Sauce Labs Backpack" -> "sauce-labs-backpack" (the demo app builds its data-test ids this way)
export const slug = (name: string): string => name.toLowerCase().replace(/\s+/g, '-');

// Public demo users printed on the login page, and the messages the app shows
export const USERS = { standard: 'standard_user', lockedOut: 'locked_out_user' } as const;

export const MESSAGES = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  badCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  notLoggedIn: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  orderComplete: 'Thank you for your order!',
} as const;

export const password = (): string => String(Cypress.expose('PASSWORD'));
