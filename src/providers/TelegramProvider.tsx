import { FC, ReactNode, useEffect } from "react";
import {
  init,
  requestFullscreen,
  popup,
  isMiniAppActive,
} from "@telegram-apps/sdk-react";

interface IProps {
  children: ReactNode;
}

const TelegramProvider: FC<IProps> = ({ children }) => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize the SDK first
        await init();

        if (isMiniAppActive()) {
          // Check if we're in a Mini App and fullscreen is available
          if (requestFullscreen && requestFullscreen.isAvailable()) {
            await requestFullscreen();
          } else {
            popup.show({
              message: "Fullscreen not available in this environment",
              timeout: 1000,
            });
          }
        }
      } catch (error) {
        console.warn("Telegram initialization failed:", error);
        popup.show({
          message: "Telegram initialization failed:",
          timeout: 1000,
        });
      }
    };

    initializeApp();
  }, []);

  return <>{children}</>;
};

export default TelegramProvider;
