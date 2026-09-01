import { FC, ReactNode, useEffect } from "react";
import {
  getWebApp,
  initTelegramApp,
  isTelegram,
  syncTelegramCssVars,
} from "../utils/helpers/telegram.helper";
import { useSettings } from "../store/settings.store";
import { useUserStore } from "../store/user.store";
import { useLanguageStore } from "../store/language.store";
import { ELanguage } from "../@types/language.type";

interface IProps {
  children: ReactNode;
}

/** Telegram'дын тил кодун колдонмонун тилине айландырат */
const toAppLanguage = (code?: string): ELanguage | null => {
  if (!code) return null;
  if (code.startsWith("ky")) return ELanguage.KG;
  if (code.startsWith("ru")) return ELanguage.RU;
  if (code.startsWith("en")) return ELanguage.EN;
  return null;
};

const TelegramProvider: FC<IProps> = ({ children }) => {
  useEffect(() => {
    const webApp = getWebApp();
    if (!webApp || !isTelegram()) return;

    initTelegramApp();

    // Тема: колдонуучу өзү тандамайынча Telegram'дын темасын ээрчийбиз
    const settings = useSettings.getState();
    if (!settings.isThemeManual) {
      settings.setDarkMode(webApp.colorScheme === "dark");
    }

    // Профилди Telegram аккаунтунан толтуруу (бош болсо гана)
    const tgUser = webApp.initDataUnsafe?.user;
    if (tgUser) {
      const { user, setUser } = useUserStore.getState();
      if (!user?.name) {
        setUser({
          ...user,
          name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" "),
          email: user?.email ?? "",
          photoUrl: user?.photoUrl,
        });
      }

      const language = toAppLanguage(tgUser.language_code);
      const languageStore = useLanguageStore.getState();
      if (language && !languageStore.isLanguageManual) {
        languageStore.setLanguage(language, false);
      }
    }

    const onThemeChanged = () => {
      syncTelegramCssVars();
      const state = useSettings.getState();
      if (!state.isThemeManual) {
        state.setDarkMode(webApp.colorScheme === "dark");
      }
    };

    webApp.onEvent?.("themeChanged", onThemeChanged);
    webApp.onEvent?.("viewportChanged", syncTelegramCssVars);
    webApp.onEvent?.("safeAreaChanged", syncTelegramCssVars);
    webApp.onEvent?.("contentSafeAreaChanged", syncTelegramCssVars);

    return () => {
      webApp.offEvent?.("themeChanged", onThemeChanged);
      webApp.offEvent?.("viewportChanged", syncTelegramCssVars);
      webApp.offEvent?.("safeAreaChanged", syncTelegramCssVars);
      webApp.offEvent?.("contentSafeAreaChanged", syncTelegramCssVars);
    };
  }, []);

  return <>{children}</>;
};

export default TelegramProvider;
