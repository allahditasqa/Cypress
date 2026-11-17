/** The burger menu in the page header: a reusable component, the same on every logged-in page. */
class HeaderMenu {
  open(): this {
    cy.get('#react-burger-menu-btn').click();
    return this;
  }

  logout(): this {
    this.open();
    cy.getByTestId('logout-sidebar-link').click();
    return this;
  }
}

export const headerMenu = new HeaderMenu();
