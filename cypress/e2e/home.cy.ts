describe("Башкы бет", () => {
  it("Саламдашуу, ат жана тамак эсепчиги көрүнөт", () => {
    cy.visitApp("/home");

    const greetings = [
      "Кайырлуу таң",
      "Кайырлуу күн",
      "Кайырлуу кеч",
      "Кайырлуу түн",
    ];
    cy.get("h1").contains("NUR MAX");
    cy.contains("p", new RegExp(greetings.join("|"))).should("be.visible");
    // Баштапкы абалда — эч бир тамак белгиленген эмес
    cy.contains("0/4 тамак белгиленди").scrollIntoView().should("be.visible");
  });

  it("Бюджет картасы бүгүнкү абалды көрсөтөт", () => {
    cy.visitApp("/home");

    cy.contains("Бүгүнкү чыгым").scrollIntoView().should("be.visible");
    cy.contains("0 сом").should("be.visible");
    cy.contains("/ 600 сом").should("be.visible");
    cy.contains("Калды:").should("be.visible");
    cy.contains("Аптада: 0 сом").should("be.visible");
    cy.contains("Айда: 0 сом").should("be.visible");
  });

  it("«Бүт аптаны көрүү» тамактар бетине өтөт", () => {
    cy.visitApp("/home");

    cy.contains("button", "Бүт аптаны көрүү").click();
    cy.location("pathname").should("eq", "/foods");
  });

  it("Бүгүнкү картанын ичиндеги тамактардын баалары көрүнөт", () => {
    cy.visitApp("/home");

    // Демейки тандалган күн — бүгүн; MealCard aria-label = жума күнү
    cy.get("section[aria-label]").first().scrollIntoView();
    cy.get("section[aria-label]")
      .first()
      .within(() => {
        cy.get("button[aria-label='Белгилөө']").should("have.length", 4);
        cy.get("button[aria-label='Алмаштыруу']").should("have.length", 4);
        cy.contains("button", /\d+ сом/).should("be.visible");
      });
  });

  it("Тамак белгилегенде эсепчик жаңырйт", () => {
    cy.visitApp("/home");

    cy.get("button[aria-label='Белгилөө']").first().click();
    cy.contains("1/4 тамак белгиленди").scrollIntoView().should("be.visible");

    // Белгини алуу — кайра 0
    cy.get("button[aria-label='Белгини алуу']").first().click();
    cy.contains("0/4 тамак белгиленди").scrollIntoView().should("be.visible");
  });

  it("Белгиленген тамак бюджетке чыгым катары жазылат", () => {
    cy.visitApp("/home");

    // Тамактын баасын салыштыруу үчүн сактайбыз
    let price = "";
    cy.get("section[aria-label]")
      .first()
      .contains("button", /\d+ сом/)
      .invoke("text")
      .then((text) => {
        price = text.trim();
      });

    cy.get("button[aria-label='Белгилөө']").first().click();

    cy.get('ion-tab-button[tab="budget"]').click();
    cy.contains("Күндүн чыгымдары").scrollIntoView().should("be.visible");
    // Чыгымдын суммасы = тамактын баасы, эскертүүсү = тамактын аты
    cy.get("li").should("have.length.at.least", 1);
    cy.contains("li", price).scrollIntoView().should("be.visible");
  });

  it("Күн тандоо иштешет", () => {
    cy.visitApp("/home");

    // Күн тилкесиндеги экинчи күнгө өтөбүз (тексти: кыска жума күнү + саны)
    cy.contains("button", /^(Жш|Дш|Шш|Шр|Бш|Жм|Иш)\d+$/).click();
    cy.get("section[aria-label]")
      .first()
      .within(() => {
        cy.get("button[aria-label='Белгилөө']").should("have.length", 4);
      });
  });
});
