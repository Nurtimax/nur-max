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

interface IProps {
  title: string;
}
const SettingsContent: FC<IProps> = ({ title }) => {
  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
  };

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
              checked={true}
              onIonChange={(e) => toggleDarkPalette(e.detail.checked)}
            >
              <IonLabel>Темный режим</IonLabel>
            </IonToggle>
          </IonItem>
          <IonItem className={classes.item} disabled>
            <IonToggle checked={false}>
              <IonLabel>Уведомления</IonLabel>
            </IonToggle>
          </IonItem>
        </IonList>

        <div className={classes.version}>
          <p className={classes.versionText}>
            Версия приложения: {jsonFile.version}
          </p>
        </div>
      </div>
    </IonContent>
  );
};

export default SettingsContent;
