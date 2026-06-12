import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        exitFullscreen?: () => void;
      };
    };
  }
}

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// После рендера, когда WebApp точно инициализирован
// if (window.Telegram?.WebApp) {
//   window.Telegram.WebApp.ready?.(); // Сообщаем, что приложение готово

//   // Лучше использовать SDK вместо raw postMessage
//   window.Telegram.WebApp.exitFullscreen?.();

//   // ИЛИ если нужен именно raw postMessage:
// }
const data = JSON.stringify({
  eventType: "web_app_exit_fullscreen",
});
window.parent.postMessage(data, "https://web.telegram.org");
