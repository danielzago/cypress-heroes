declare namespace Cypress {
  interface Chainable {
    /**
     * Comando customizado para realizar login
     * @example cy.login('email@teste.com', 'senha123')
     */
    login(email: string, password: string): Chainable<Element>;
  }
}