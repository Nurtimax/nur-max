import { FC, ReactNode, useEffect, useState } from "react";
import {
  init,
  requestFullscreen,
  isMiniAppActive,
} from "@telegram-apps/sdk-react";

interface IProps {
  children: ReactNode;
}

const TelegramProvider: FC<IProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Инициализация
        await init();
        console.log("✅ SDK init complete");

        // 2. Ждем готовности с проверкой
        await waitForSDKReady();

        // 3. Проверяем окружение
        if (isMiniAppActive && isMiniAppActive()) {
          console.log("✅ Running in Mini App");

          // 4. Пробуем fullscreen
          if (requestFullscreen) {
            try {
              await requestFullscreen();
              console.log("✅ Fullscreen activated");
            } catch (e) {
              console.warn("Fullscreen request failed:", e);
            }
          }
        } else {
          console.log("ℹ️ Not in Mini App");
        }

        setIsReady(true);
      } catch (error) {
        console.warn("Initialization error:", error);
        setIsReady(true);
      }
    };

    // Функция ожидания готовности SDK
    const waitForSDKReady = async () => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        // Проверяем, что SDK полностью готов
        const isReady = requestFullscreen?.isAvailable?.() !== undefined;

        if (isReady) {
          console.log(`✅ SDK ready after ${attempts + 1} attempts`);
          return true;
        }

        // Ждем 200ms перед следующей проверкой
        await new Promise((resolve) => setTimeout(resolve, 200));
        attempts++;
        console.log(`⏳ Waiting for SDK... attempt ${attempts}/${maxAttempts}`);
      }

      console.warn("⚠️ SDK not ready after max attempts");
      return false;
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default TelegramProvider;
