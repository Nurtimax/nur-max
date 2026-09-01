import { TelegramSafeAreaInset, TelegramWebApp } from "../../@types/telegram";

export const getWebApp = (): TelegramWebApp | undefined =>
  typeof window === "undefined" ? undefined : window.Telegram?.WebApp;

/**
 * Скрипт telegram-web-app.js браузерде да window.Telegram.WebApp түзөт,
 * ошондуктан чыныгы Telegram кардары экенин platform боюнча текшеребиз.
 */
export const isTelegram = (): boolean => {
  const webApp = getWebApp();
  return Boolean(webApp?.platform) && webApp?.platform !== "unknown";
};

/** Telegram кардары бул версияны колдойбу */
const supports = (version: string): boolean => {
  const webApp = getWebApp();
  try {
    return Boolean(webApp?.isVersionAtLeast?.(version));
  } catch {
    return false;
  }
};

/** Кнопка басылганда жеңил вибрация */
export const haptic = (
  style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light",
) => {
  try {
    getWebApp()?.HapticFeedback?.impactOccurred?.(style);
  } catch {
    /* Telegramдан тышкары иштебейт — маанилүү эмес */
  }
};

export const hapticSuccess = () => {
  try {
    getWebApp()?.HapticFeedback?.notificationOccurred?.("success");
  } catch {
    /* ignore */
  }
};

export const hapticSelection = () => {
  try {
    getWebApp()?.HapticFeedback?.selectionChanged?.();
  } catch {
    /* ignore */
  }
};

const applyInset = (prefix: string, inset?: TelegramSafeAreaInset) => {
  const root = document.documentElement;
  const value = inset ?? { top: 0, bottom: 0, left: 0, right: 0 };
  root.style.setProperty(`${prefix}-top`, `${value.top || 0}px`);
  root.style.setProperty(`${prefix}-bottom`, `${value.bottom || 0}px`);
  root.style.setProperty(`${prefix}-left`, `${value.left || 0}px`);
  root.style.setProperty(`${prefix}-right`, `${value.right || 0}px`);
};

/** Telegramдын тема түстөрүн жана коопсуз аймактарын CSS өзгөрмөлөргө көчүрөт */
export const syncTelegramCssVars = () => {
  const webApp = getWebApp();
  if (!webApp) return;

  const root = document.documentElement;

  Object.entries(webApp.themeParams || {}).forEach(([key, value]) => {
    if (typeof value === "string") {
      root.style.setProperty(`--tg-theme-${key.replace(/_/g, "-")}`, value);
    }
  });

  if (webApp.viewportStableHeight) {
    root.style.setProperty(
      "--tg-viewport-stable-height",
      `${webApp.viewportStableHeight}px`,
    );
  }
  if (webApp.viewportHeight) {
    root.style.setProperty("--tg-viewport-height", `${webApp.viewportHeight}px`);
  }

  applyInset("--tg-safe-area-inset", webApp.safeAreaInset);
  applyInset("--tg-content-safe-area-inset", webApp.contentSafeAreaInset);
};

/** Mini App'ты даярдап, толук экранга жайып, свайп менен жабылуудан коргойт */
export const initTelegramApp = () => {
  const webApp = getWebApp();
  if (!webApp) return;

  webApp.ready?.();
  webApp.expand?.();

  if (supports("7.7")) {
    webApp.disableVerticalSwipes?.();
  }
  if (supports("8.0") && !webApp.isFullscreen) {
    try {
      webApp.requestFullscreen?.();
    } catch {
      /* fullscreen колдоого алынбашы мүмкүн */
    }
  }

  syncTelegramCssVars();
};

/** Telegram интерфейсинин түстөрүн колдонмонун темасына окшоштурат */
export const applyTelegramChrome = (isDark: boolean) => {
  const webApp = getWebApp();
  if (!webApp || !supports("6.1")) return;

  const background = isDark ? "#0e1116" : "#f4f6fa";
  try {
    webApp.setHeaderColor?.(background);
    webApp.setBackgroundColor?.(background);
    if (supports("7.10")) {
      webApp.setBottomBarColor?.(background);
    }
  } catch {
    /* эски версияларда колдоого алынбайт */
  }
};
