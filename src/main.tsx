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
// Прослушиваем все postMessage сообщения

window.addEventListener("message", (event) => {
  console.log("📨 Получено сообщение:", event.data);
  console.log("📌 Отправитель:", event.origin);
});

// Ваш код
const data = JSON.stringify({
  eventType: "web_app_request_fullscreen",
});

if (window.parent !== window) {
  window.parent.postMessage(data, "https://web.telegram.org");
  console.log("✅ Сообщение отправлено");
}
