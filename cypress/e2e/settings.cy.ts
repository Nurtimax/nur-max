describe("Орнотуулар бети", () => {
  it("Бардык элементтер көрүнөт", () => {
    cy.visitApp("/settings");

    cy.get("h1").contains("Орнотуулар");
    cy.contains("Караңгы режим").should("be.visible");
    cy.contains("Күнүмдүк лимит").should("be.visible");
    cy.contains("Тилди тандоо").should("be.visible");
    cy.contains("Билдирүүлөр").should("be.visible");
    // Версия жана платформа
    cy.contains("Платформа: web · Версия: 2.1.1").should("be.visible");
  });

  it("Караңгы режим күйгүзүлөт жана өчүрүлөт", () => {
    cy.visitApp("/settings");

    // Демейки — караңгы
    cy.document()
      .its("documentElement.className")
      .should("contain", "ion-palette-dark");

    cy.contains("ion-toggle", "Караңгы режим").click();
    cy.document()
      .its("documentElement.className")
      .should("not.contain", "ion-palette-dark");

    cy.contains("ion-toggle", "Караңгы режим").click();
    cy.document()
      .its("documentElement.className")
      .should("contain", "ion-palette-dark");
  });

  it("Билдирүүлөр өтмөгү өчүк абалда", () => {
    cy.visitApp("/settings");

    cy.contains("ion-item", "Билдирүүлөр").within(() => {
      cy.get("ion-toggle").should("have.attr", "disabled");
    });
  });

  it("Күнүмдүк лимитти өзгөртүү бюджетке таасир этет", () => {
    cy.visitApp("/settings");

    cy.contains("ion-input", "Күнүмдүк лимит")
      .find("input")
      .clear()
      .type("1500");

    cy.get('ion-tab-button[tab="budget"]').click();
    cy.contains("/ 1 500 сом").should("be.visible");
  });

  it("Тилди орусчага алмаштыруу", () => {
    cy.visitApp("/settings");

    cy.get("ion-select").click();
    cy.get("ion-action-sheet")
      .contains("button", "Русский")
      .click({ force: true });

    // Өтмөк тактасынын жазуулары орусчага которулду
    cy.get('ion-tab-button[tab="home"]').contains("Главная");
    cy.get('ion-tab-button[tab="foods"]').contains("Продукты");
    cy.get('ion-tab-button[tab="budget"]').contains("Деньги");
    cy.get('ion-tab-button[tab="settings"]').contains("Настройки");
    cy.get("h1").contains("Настройки");
  });

  it("Тилди англисче алмаштыруу", () => {
    cy.visitApp("/settings", {
      "language-store": { language: "ru", isLanguageManual: true },
    });

    cy.get("ion-select").click();
    cy.get("ion-action-sheet")
      .contains("button", "English")
      .click({ force: true });

    cy.get('ion-tab-button[tab="home"]').contains("Home");
    cy.get('ion-tab-button[tab="budget"]').contains("Money");
    cy.get("h1").contains("Settings");
  });
});
