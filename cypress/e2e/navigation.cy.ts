describe("Навигация", () => {
  it("Башкы бетке редирект кылат", () => {
    cy.visitApp("/");
    cy.location("pathname").should("eq", "/home");
    cy.get("h1").contains("NUR MAX").should("be.visible");
  });

  it("Төмөнкү өтмөк тактасында 5 таб бар", () => {
    cy.visitApp("/home");
    const tabs = [
      { tab: "home", label: "Башкы бет" },
      { tab: "foods", label: "Тамактар" },
      { tab: "budget", label: "Акча" },
      { tab: "profile", label: "Профиль" },
      { tab: "settings", label: "Орнотуулар" },
    ];
    cy.get("ion-tab-bar ion-tab-button").should("have.length", 5);
    tabs.forEach(({ tab, label }) => {
      cy.get(`ion-tab-button[tab="${tab}"]`)
        .should("be.visible")
        .and("contain.text", label);
    });
  });

  it("Ар бир таб өз бетине өтөт", () => {
    cy.visitApp("/home");

    const pages = [
      { tab: "foods", path: "/foods", title: "Тамактар" },
      { tab: "budget", path: "/budget", title: "Акча" },
      { tab: "profile", path: "/profile", title: "Профиль" },
      { tab: "settings", path: "/settings", title: "Орнотуулар" },
      { tab: "home", path: "/home", title: "NUR MAX" },
    ];

    pages.forEach(({ tab, path, title }) => {
      cy.get(`ion-tab-button[tab="${tab}"]`).click();
      cy.location("pathname").should("eq", path);
      cy.get("h1").contains(title).scrollIntoView().should("be.visible");
    });
  });

  it("Белгисиз даректе колдонмонун кабыгы калат, бирок бет жок", () => {
    cy.visit("/unknown-route", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    cy.get("ion-tab-bar", { timeout: 15000 }).should("be.visible");
    // Маршрут табылган жок — контент жок
    cy.get("h1").should("not.exist");
  });
});
