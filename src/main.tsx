import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        expand: () => void;
        // add other WebApp properties you need here
      };
    };
  }
}

const app = window.Telegram.WebApp;

app.expand();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
