import {
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import {
  informationCircleOutline,
  languageOutline,
  moonOutline,
  notificationsOutline,
  walletOutline,
} from "ionicons/icons";
import { FC } from "react";
import classes from "../page.module.css";
import jsonFile from "../../../../package.json";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";
import { useSettings } from "../../../store/settings.store";
import { useLanguageStore } from "../../../store/language.store";
import { ELanguage } from "../../../@types/language.type";
import { haptic, hapticSelection } from "../../../utils/helpers/telegram.helper";
import { useBudgetStore } from "../../../store/budget.store";

const SettingsContent: FC = () => {
  const darkMode = useSettings((state) => state.darkMode);
  const isNotification = useSettings((state) => state.isNotification);
  const setToggleDarkMode = useSettings((state) => state.setToggleDarkMode);
  const setToggleNotification = useSettings(
    (state) => state.setToggleNotification,
  );

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.settings;

  const dailyLimit = useBudgetStore((state) => state.dailyLimit);
  const setDailyLimit = useBudgetStore((state) => state.setDailyLimit);
  const budgetText = languageState.pages.budget;

  const { platform } = useTelegramFullscreen();

  return (
    <IonContent fullscreen>
      <div className={classes.content}>
        <IonList lines="none" className={classes.list}>
          <IonItem className={classes.item}>
            <span className={`${classes.icon} ${classes.iconDark}`}>
              <IonIcon icon={moonOutline} />
            </span>
            <IonToggle
              checked={darkMode}
              onIonChange={() => {
                haptic("light");
                setToggleDarkMode();
              }}
            >
              {t.dark_mode}
            </IonToggle>
          </IonItem>

          <IonItem className={classes.item}>
            <span className={`${classes.icon} ${classes.iconMoney}`}>
              <IonIcon icon={walletOutline} />
            </span>
            <IonInput
              className={classes.limitInput}
              type="number"
              inputmode="numeric"
              label={budgetText.daily_limit}
              labelPlacement="stacked"
              value={dailyLimit}
              placeholder={budgetText.daily_limit_hint}
              onIonInput={(e) => setDailyLimit(Number(e.detail.value))}
            />
            <span slot="end" className={classes.currency}>
              {languageState.common.currency}
            </span>
          </IonItem>

          <IonItem className={classes.item}>
            <span className={`${classes.icon} ${classes.iconLang}`}>
              <IonIcon icon={languageOutline} />
            </span>
            <IonSelect
              aria-label={t.language}
              label={t.language_label}
              interface="action-sheet"
              placeholder={t.language_placeholder}
              value={language}
              onIonChange={(e) => {
                hapticSelection();
                setLanguage(e.detail.value);
              }}
              cancelText={t.language_cancel}
              labelPlacement="stacked"
            >
              <IonSelectOption value={ELanguage.KG}>🇰🇬 Кыргызча</IonSelectOption>
              <IonSelectOption value={ELanguage.RU}>🇷🇺 Русский</IonSelectOption>
              <IonSelectOption value={ELanguage.EN}>🇬🇧 English</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className={classes.item} disabled>
            <span className={`${classes.icon} ${classes.iconBell}`}>
              <IonIcon icon={notificationsOutline} />
            </span>
            <IonToggle
              checked={isNotification}
              onIonChange={() => setToggleNotification()}
            >
              {t.notifications}
            </IonToggle>
          </IonItem>
        </IonList>

        <div className={classes.version}>
          <IonIcon icon={informationCircleOutline} />
          <span>
            {t.platform}: {platform || "web"} · {t.version}: {jsonFile.version}
          </span>
        </div>
      </div>
    </IonContent>
  );
};

export default SettingsContent;
