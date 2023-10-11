// cypress/integration/userListAndProfile_spec.js

describe("User Management", () => {
  it("should navigate to users list and view user profile", () => {
    cy.visit("http://localhost:5173");

    cy.intercept("GET", "https://jsonplaceholder.typicode.com/users", {
      fixture: "users.json",
    }).as("getUsers");

    cy.get("ul").within(() => {
      cy.get("li").should("have.length", 2);

      cy.contains("User One");
      cy.contains("User Two");
    });

    cy.get('a[href="/user/1"]').click();

    cy.intercept("GET", "https://jsonplaceholder.typicode.com/users/1", {
      fixture: "user1.json",
    }).as("getUser");

    cy.get('input[id="name"]').should("have.value", "User One");

    cy.get('input[id="email"]').should("have.value", "userone@example.com");
  });
});
