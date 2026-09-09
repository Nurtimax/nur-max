describe("Акча бети", () => {
  it("Баштапкы абалдын элементтери көрүнөт", () => {
    cy.visitAppWithBudget();

    cy.get("h1").contains("Акча");
    cy.contains("Күнүмдүк чыгым").should("be.visible");
    cy.contains("Аптада").should("be.visible");
    cy.contains("Бүгүнкү чыгым").should("be.visible");
    cy.contains("Айда").should("be.visible");
    cy.contains("Күндүн чыгымдары").should("be.visible");
    // Чыгым жок — бош абалдын тексти
    cy.contains("Бул күнгө чыгым жазылган жок").should("be.visible");
    cy.contains("0% лимиттин").should("be.visible");
  });

  it("Чыгым кошуу терезеси ачылат", () => {
    cy.visitAppWithBudget();

    cy.contains("button", "Чыгым кошуу").click();
    cy.get("ion-modal").should("be.visible");
    cy.get("ion-modal").within(() => {
      cy.contains("h2", "Чыгым кошуу").should("be.visible");
      // Тез суммалар
      ["+50", "+100", "+200", "+500"].forEach((quick) =>
        cy.contains("button", quick).should("be.visible"),
      );
      // Категориялар
      ["Эртең менен", "Түшкү", "Кечки", "Жемиш", "Башка"].forEach((cat) =>
        cy.contains("button", cat).should("be.visible"),
      );
      cy.contains("Эскертүү").should("be.visible");
      // Сумма жок — сактоо өчүк
      cy.contains("ion-button", "Сактоо").should("have.attr", "disabled");
    });
  });

  it("Жаңы чыгым кошуп, тизмеде көрүү жана өчүрүү", () => {
    cy.visitAppWithBudget();

    cy.contains("button", "Чыгым кошуу").click();
    cy.get("ion-modal").should("be.visible");
    cy.get("ion-modal").within(() => {
      cy.contains("button", "+100").click();
      cy.contains("button", "+200").click();
      cy.contains("button", "Башка").click();
      cy.get("input").last().type("Сынак чыгымы");
      cy.contains("ion-button", "Сактоо · 300 сом").click();
    });

    // Терезе жабылды, тизмеде категория, эскертүү жана сумма
    cy.get("ion-modal").should("not.be.visible");
    cy.get("li").should("have.length", 1).contains("Сынак чыгымы");
    cy.contains("li", "300 сом").should("be.visible");
    // Бүгүнкү статистика жаңырды
    cy.contains("Бүгүнкү чыгым").should("be.visible");

    // Өчүрүү
    cy.get("button[aria-label='Өчүрүү']").click();
    cy.contains("Бул күнгө чыгым жазылган жок").should("be.visible");
  });

  it("Күн баскычтары менен күн алмашуу", () => {
    cy.visitAppWithBudget();

    // Бүгүн эмес башка күнгө өтөбүз (бүгүндөн кийинки күн)
    const target = new Date();
    target.setDate(target.getDate() + 1);
    if (target.getMonth() !== new Date().getMonth()) {
      // Айдын агы — мурунку күнгө
      target.setDate(target.getDate() - 2);
    }
    const day = target.getDate();

    // Күндүн саны өзүнчө span'да — баскычын басабыз
    cy.contains("span", new RegExp(`^${day}$`)).closest("button").click();
    cy.contains("Бул күнгө чыгым жазылган жок").should("be.visible");
  });

  it("Сакталган чыгымдарды күнү боюнча көрсөтөт", () => {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const dayKey = `${now.getFullYear()}-${month}-01`;
    cy.visitAppWithBudget([
      {
        id: "test-1",
        date: dayKey,
        amount: 250,
        category: "other",
        note: "Эски чыгым",
        createdAt: Date.now(),
      },
    ]);

    // 1-күн башка аптада — апта өтмөгү менен өтөбүз
    cy.contains("button", /^1-апта/).click();
    cy.contains("span", /^1$/).closest("button").click();
    cy.contains("li", "Эски чыгым").should("be.visible");
    cy.contains("li", "250 сом").should("be.visible");
    // Тизмеден өчүргөндө да сакталат абал
    cy.contains("Аптада").should("be.visible");
  });

  it("Күнүмдүк лимит статистикада чагылдырылат", () => {
    cy.visitAppWithBudget([], 1000);

    cy.contains("/ 1 000 сом").should("be.visible");
  });
});
