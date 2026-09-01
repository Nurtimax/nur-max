// hooks/useTelegramFullscreen.ts
import { useEffect, useState } from "react";
import {
  getWebApp,
  isTelegram,
  syncTelegramCssVars,
} from "../utils/helpers/telegram.helper";

interface TelegramState {
  platform: string | null;
  isFullscreen: boolean;
  isTelegram: boolean;
  colorScheme: "light" | "dark" | null;
}

const readState = (): TelegramState => {
  const webApp = getWebApp();
  const inTelegram = isTelegram();

  return {
    // Telegramдан тышкары "unknown" келет — аны көрсөтпөйбүз
    platform: inTelegram ? (webApp?.platform ?? null) : null,
    isFullscreen: (inTelegram && webApp?.isFullscreen) || false,
    isTelegram: inTelegram,
    colorScheme: webApp?.colorScheme ?? null,
  };
};

export const useTelegramFullscreen = () => {
  const [state, setState] = useState<TelegramState>(readState);

  useEffect(() => {
    const webApp = getWebApp();
    if (!webApp) return;

    const update = () => {
      syncTelegramCssVars();
      setState(readState());
    };

    update();

    webApp.onEvent?.("fullscreenChanged", update);
    webApp.onEvent?.("viewportChanged", update);
    webApp.onEvent?.("themeChanged", update);
    webApp.onEvent?.("safeAreaChanged", update);
    webApp.onEvent?.("contentSafeAreaChanged", update);

    return () => {
      webApp.offEvent?.("fullscreenChanged", update);
      webApp.offEvent?.("viewportChanged", update);
      webApp.offEvent?.("themeChanged", update);
      webApp.offEvent?.("safeAreaChanged", update);
      webApp.offEvent?.("contentSafeAreaChanged", update);
    };
  }, []);

  return state;
};
