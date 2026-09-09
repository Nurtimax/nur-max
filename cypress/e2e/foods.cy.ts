// Бүгүнкү жума күнүнүн кыргызча аталышы
const todayWeekday = (): string => {
  const weekdays = [
    "Жекшемби",
    "Дүйшөмбү",
    "Шейшемби",
    "Шаршемби",
    "Бейшемби",
    "Жума",
    "Ишемби",
  ];
  return weekdays[new Date().getDay()];
};

// Бүгүнкү аптанын өтмөгүн басат (план жүктөлгөндөн кийин активдүү апта 1-болуп калат)
const openTodayWeek = (): void => {
  const today = new Date().getDate();
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();
  const from = Math.floor((today - 1) / 7) * 7 + 1;
  const to = Math.min(from + 6, daysInMonth);
  cy.contains("button", `${from}–${to}`).click();
};

describe("Тамактар бети", () => {
  it("Апта өтмөктөрү жана жыйынтык көрүнөт", () => {
    cy.visitApp("/foods");

    cy.get("h1").contains("Тамактар");
    cy.contains("Тамактардын тизмеси").should("be.visible");
    // Ай 4 аптага бөлүнөт — ар биринде 28 тамак (7 күн × 4)
    cy.get("button").contains(/\d-апта/).should("be.visible");
    cy.contains(/\d+\/28 · 0%/).should("be.visible");
  });

  it("Бүгүнкү күн демейки ачык, башкалары жыйылган", () => {
    cy.visitApp("/foods");
    openTodayWeek();

    // Жыйылган карталардын ичиндеги катарлар DOM'до жок — 4 баскыч гана
    cy.get(`section[aria-label="${todayWeekday()}"]`)
      .scrollIntoView()
      .within(() => {
        cy.get("button[aria-label='Белгилөө']").should("have.length", 4);
        cy.get("button[aria-label='Алмаштыруу']").should("have.length", 4);
      });
  });

  it("Карта жыйылып-ачылат", () => {
    cy.visitApp("/foods");
    openTodayWeek();

    const weekdayPattern = /Жекшемби|Дүйшөмбү|Шейшемби|Шаршемби|Бейшемби|Жума|Ишемби/;
    cy.contains("section", weekdayPattern).first().find("header").click();
    // Бардык карталар жыйылды — белгилөө баскычтары жок
    cy.get("button[aria-label='Белгилөө']").should("have.length", 0);

    cy.contains("section", weekdayPattern).first().find("header").click();
    cy.get("button[aria-label='Белгилөө']").should("have.length", 4);
  });

  it("Тамак белгилөө жана белгини алуу", () => {
    cy.visitApp("/foods");
    openTodayWeek();

    cy.get(`section[aria-label="${todayWeekday()}"]`)
      .find("button[aria-label='Белгилөө']")
      .first()
      .click();
    cy.get("button[aria-label='Белгини алуу']").should("have.length", 1);

    cy.get("button[aria-label='Белгини алуу']").first().click();
    cy.get("button[aria-label='Белгилөө']").should("have.length", 4);
  });

  it("Тамакты алмаштыруу атын өзгөртөт", () => {
    cy.visitApp("/foods");
    openTodayWeek();

    let initial = "";
    cy.get(`section[aria-label="${todayWeekday()}"]`)
      .invoke("text")
      .then((text) => {
        initial = text;
      })
      .then(() => swapUntilChanged(0));

    // Кокустан ошол эле тамак келип калса — кайра алмаштырып көбөйтөбүз
    function swapUntilChanged(attempt: number): void {
      cy.get(`section[aria-label="${todayWeekday()}"]`)
        .find("button[aria-label='Алмаштыруу']")
        .first()
        .click();
      cy.get(`section[aria-label="${todayWeekday()}"]`)
        .invoke("text")
        .then((text) => {
          if (text === initial && attempt < 5) {
            swapUntilChanged(attempt + 1);
            return;
          }
          expect(text).not.to.eq(initial);
        });
    }
  });

  it("Тамактын суммасын өзгөртүү мүмкүн", () => {
    cy.visitApp("/foods");
    openTodayWeek();

    cy.get(`section[aria-label="${todayWeekday()}"]`)
      .scrollIntoView()
      .within(() => {
        cy.contains("button", /\d+ сом/).first().click();
        cy.get("input[type='number']").clear().type("123{enter}");
        cy.contains("button", "123 сом").should("be.visible");
      });
  });
});
