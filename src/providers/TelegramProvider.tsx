/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect, useState } from "react";

interface IProps {
  children: ReactNode;
}

const TelegramProvider: FC<IProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🔄 Initializing Telegram...");

        // 1. Проверяем окружение
        const isTelegram = !!(window as any).Telegram?.WebApp;

        if (isTelegram) {
          console.log("✅ Running in Telegram");

          // 2. Отправляем событие готовности
          sendTelegramEvent("web_app_ready");
          console.log("✅ web_app_ready sent");

          // 3. Запрашиваем fullscreen
          await requestFullscreenNative();

          // 4. Расширяем Mini App
          sendTelegramEvent("web_app_expand");
          console.log("✅ web_app_expand sent");
        } else {
          console.log("ℹ️ Not in Telegram");
        }

        setIsReady(true);
      } catch (error) {
        console.warn("Telegram initialization error:", error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

// Функция для отправки событий в Telegram
const sendTelegramEvent = (eventType: string, eventData?: any) => {
  const data = JSON.stringify({
    eventType,
    eventData: eventData || {},
  });

  // Web версия
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(data, "https://web.telegram.org");
      console.log(`📤 Sent via postMessage: ${eventType}`);
      return;
    } catch (e) {
      console.warn("postMessage failed:", e);
    }
  }

  // Desktop/Mobile версия
  const proxy = (window as any).TelegramWebviewProxy;
  if (proxy?.postEvent) {
    try {
      const params = eventData ? JSON.stringify(eventData) : "{}";
      proxy.postEvent(eventType, params);
      console.log(`📤 Sent via TelegramWebviewProxy: ${eventType}`);
      return;
    } catch (e) {
      console.warn("TelegramWebviewProxy failed:", e);
    }
  }

  // Windows Phone версия
  if ((window as any).external?.notify) {
    try {
      (window as any).external.notify(data);
      console.log(`📤 Sent via external.notify: ${eventType}`);
      return;
    } catch (e) {
      console.warn("external.notify failed:", e);
    }
  }

  console.warn(`⚠️ Could not send event: ${eventType}`);
};

// Функция запроса fullscreen
const requestFullscreenNative = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Проверяем поддержку fullscreen
      const webApp = (window as any).Telegram?.WebApp;

      if (webApp?.isFullscreen !== undefined) {
        // Если уже в fullscreen
        if (webApp.isFullscreen) {
          console.log("✅ Already in fullscreen");
          resolve(true);
          return;
        }

        // Отправляем запрос fullscreen
        sendTelegramEvent("web_app_request_fullscreen");

        // Проверяем статус fullscreen с интервалом
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (webApp.isFullscreen) {
            clearInterval(interval);
            console.log("✅ Fullscreen activated");
            resolve(true);
          } else if (attempts >= 10) {
            clearInterval(interval);
            console.log("ℹ️ Fullscreen not activated after 10 attempts");
            resolve(false);
          }
        }, 200);

        return;
      }

      // Если WebApp не доступен
      console.log("ℹ️ Fullscreen not supported");
      resolve(false);
    } catch (error) {
      console.warn("Fullscreen request error:", error);
      resolve(false);
    }
  });
};

export default TelegramProvider;
