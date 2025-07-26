/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`);
});

export {};
declare global {
  namespace Cypress {
    interface Chainable {
        getDataTest: (dataTestSelector: string) => Chainable<JQuery<HTMLElement>>;
     
    }
  }
}