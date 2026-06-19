import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { FC } from "react";
import classes from "../page.module.css";
import jsonFile from "../../../../package.json";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";
import { useSettings } from "../../../store/settings.store";

interface IProps {
  title: string;
}
const SettingsContent: FC<IProps> = ({ title }) => {
  const { darkMode, isNotification, setToggleDarkMode, setToggleNotification } =
    useSettings();

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    setToggleDarkMode();
  };

  const { platform } = useTelegramFullscreen();

  return (
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className={classes.content}>
        <IonList inset={true} className={classes.list}>
          <IonItem className={classes.item}>
            <IonToggle
              checked={darkMode}
              onIonChange={(e) => toggleDarkPalette(e.detail.checked)}
            >
              <IonLabel>Темный режим</IonLabel>
            </IonToggle>
          </IonItem>
          <IonItem className={classes.item} disabled>
            <IonToggle
              checked={isNotification}
              onIonChange={() => setToggleNotification()}
            >
              <IonLabel>Уведомления</IonLabel>
            </IonToggle>
          </IonItem>
        </IonList>

        <div className={classes.version}>
          <div>
            <p className={classes.versionText}>Платформа: {platform || ""}</p>
            <p className={classes.versionText}>Версия: {jsonFile.version}</p>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default SettingsContent;
