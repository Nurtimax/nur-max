/// <reference types="cypress" />

// Колдонуучунун zustand persist форматы: { state, version }
type TSeed = Record<string, unknown>;

declare global {
  namespace Cypress {
    interface Chainable {
      /** Колдонмону таза абалда ачат, кааласа localStorage'га состояние жазат */
      visitApp(path?: string, seeds?: Record<string, TSeed>): Chainable<void>;
      /** Бюджетти даяр чыгымдар менен сактап, колдонмону ачат */
      visitAppWithBudget(expenses?: unknown[], dailyLimit?: number): Chainable<void>;
    }
  }
}

// 1.5 сек initializing демейки күтүү менен колдонмону ачабыз
Cypress.Commands.add("visitApp", (path = "/", seeds = {}) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.clear();
      Object.entries(seeds).forEach(([key, state]) => {
        win.localStorage.setItem(key, JSON.stringify({ state, version: 0 }));
      });
    },
  });
  cy.get("ion-tab-bar", { timeout: 15000 }).should("be.visible");
});

Cypress.Commands.add("visitAppWithBudget", (expenses = [], dailyLimit = 600) => {
  cy.visitApp("/budget", {
    "budget-storage": { dailyLimit, expenses },
  });
});

export {};
