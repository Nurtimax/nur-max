import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8100",
    includeShadowDom: true,
    viewportWidth: 390,
    viewportHeight: 844,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
