import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { FC } from "react";
import classes from "../page.module.css";
import jsonFile from "../../../../package.json";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";
import { useSettings } from "../../../store/settings.store";
import { useLanguageStore } from "../../../store/language.store";
import { ELanguage } from "../../../@types/language.type";

const SettingsContent: FC = () => {
  const { darkMode, isNotification, setToggleDarkMode, setToggleNotification } =
    useSettings();

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.settings;

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    setToggleDarkMode();
  };

  const { platform } = useTelegramFullscreen();

  return (
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{t.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className={classes.content}>
        <IonList inset={true} className={classes.list}>
          <IonItem className={classes.item}>
            <IonToggle
              checked={darkMode}
              onIonChange={(e) => toggleDarkPalette(e.detail.checked)}
            >
              <IonLabel>{t.dark_mode}</IonLabel>
            </IonToggle>
          </IonItem>
          <IonItem className={classes.item}>
            <IonSelect
              aria-label={t.language}
              label={t.language_label}
              interface="action-sheet"
              placeholder={t.language_placeholder}
              value={language}
              onIonChange={(e) => setLanguage(e.detail.value)}
              cancelText={t.language_cancel}
              labelPlacement="stacked"
            >
              <IonSelectOption value={ELanguage.KG}>
                🇰🇬 Кыргызча
              </IonSelectOption>
              <IonSelectOption value={ELanguage.RU}>🇷🇺 Русский</IonSelectOption>
              <IonSelectOption value={ELanguage.EN}>🇬🇧 English</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className={classes.item} disabled>
            <IonToggle
              checked={isNotification}
              onIonChange={() => setToggleNotification()}
            >
              <IonLabel>{t.notifications}</IonLabel>
            </IonToggle>
          </IonItem>
        </IonList>

        <div className={classes.version}>
          <div>
            <p className={classes.versionText}>
              {t.platform}: {platform || ""}
            </p>
            <p className={classes.versionText}>
              {t.version}: {jsonFile.version}
            </p>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default SettingsContent;
