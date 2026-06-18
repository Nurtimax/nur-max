import { FC, ReactNode, useEffect } from "react";
import { init, requestFullscreen } from "@telegram-apps/sdk-react";

interface IProps {
  children: ReactNode;
}

const TelegramProvider: FC<IProps> = ({ children }) => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize the SDK first
        init();

        // Check if we're in a Mini App and fullscreen is available
        if (requestFullscreen && requestFullscreen.isAvailable()) {
          await requestFullscreen();
        } else {
          console.log("Fullscreen not available in this environment");
        }
      } catch (error) {
        console.warn("Telegram initialization failed:", error);
      }
    };

    initializeApp();
  }, []);

  return <>{children}</>;
};

export default TelegramProvider;
