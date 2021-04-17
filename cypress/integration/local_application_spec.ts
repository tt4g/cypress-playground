describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });
});

describe("Count", () => {
  const countSelector = '[data-testid="Count-count"]';
  const incrementSelector = '[data-testid="Count-button-increment"]';

  beforeEach(() => {
    cy.visit("/");
  });

  it("Initial count is 0.", () => {
    cy.get(countSelector).contains(/^Count: 0$/);
  });

  it("Increment", () => {
    const increment = cy.get(incrementSelector);
    increment.contains(/^\+1$/);

    increment.click();
    cy.get(countSelector).contains(/^Count: 1$/);
  });

  it("Decrement", () => {
    const decrement = cy.get('[data-testid="Count-button-decrement"]');
    decrement.contains(/^-1$/);

    decrement.click();
    cy.get(countSelector).contains(/^Count: -1$/);
  });

  it("Rest count", () => {
    cy.get(incrementSelector).click().click();
    cy.get(countSelector).contains(/^Count: 2$/);

    const resetCount = cy.get('[data-testid="Count-button-resetCount"]');
    resetCount.contains(/^Reset$/);

    resetCount.click();
    cy.get(countSelector).contains(/^Count: 0$/);
  });
});
