// cypress/support/commands.ts

declare global {
  namespace Cypress {
    interface Chainable {
      setBurgerTokens(): any;
      getByCy(selector: string): any;
    }
  }
}

// Кастомная команда для установки токенов авторизации
Cypress.Commands.add('setBurgerTokens', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-refresh-token');
    win.localStorage.setItem('accessToken', 'test-access-token');
  });
  cy.setCookie('accessToken', 'test-access-token');
});

// Кастомная команда для получения элемента по data-cy атрибуту
Cypress.Commands.add('getByCy', (selector: string) =>
  cy.get(`[data-cy="${selector}"]`)
);
