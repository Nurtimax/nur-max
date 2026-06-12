import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import classes from "../page.module.css";
import jsonFile from "../../../../package.json";

interface IProps {
  title: string;
}
const SettingsContent: FC<IProps> = ({ title }) => {
  return (
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className={classes.content}>
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
