import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const data = JSON.stringify({
  eventType: "web_app_exit_fullscreen",
  eventData: {
    is_visible: true,
  },
});

window.parent.postMessage(data, "https://web.telegram.org");

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
