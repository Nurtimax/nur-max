describe("Профиль бети", () => {
  it("Форманын элементтери көрүнөт", () => {
    cy.visitApp("/profile");

    cy.get("h1").contains("Профиль");
    cy.contains("Аты-жөнү").should("be.visible");
    cy.contains("Электрондук почта").should("be.visible");
    cy.contains("Сүрөт URL").should("be.visible");
    // Баштапкы абалда сактоо баскычы өчүк (formik.dirty = false)
    cy.contains("ion-button", "Сактоо").should("have.attr", "disabled");
  });

  it("Профильди толтуруп сактоо", () => {
    cy.visitApp("/profile");

    cy.get('ion-input[name="name"]').find("input").type("Айбек Тестов");
    cy.get('ion-input[name="email"]').find("input").type("aibek@example.com");
    cy.contains("ion-button", "Сактоо").should("not.have.attr", "disabled");
    cy.contains("ion-button", "Сактоо").click();

    // Ийгилик билдирүүсү чыгат
    cy.get("ion-toast").contains("Профиль ийгиликтүү сакталды");
    // Аватар бөлүгүндө аты көрүнөт
    cy.get("h2").contains("Айбек Тестов").should("be.visible");
    cy.contains("aibek@example.com").should("be.visible");
  });

  it("Сакталган профиль кайра жүктөгөндө сакталат", () => {
    cy.visitApp("/profile", {
      "user-storage": {
        user: {
          name: "Нургул",
          email: "nurgul@example.com",
          photoUrl: "",
        },
      },
    });

    cy.get('ion-input[name="name"]').should("have.value", "Нургул");
    cy.get("h2").contains("Нургул").should("be.visible");
  });
});
