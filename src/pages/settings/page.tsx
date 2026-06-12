import { IonPage } from "@ionic/react";
import SettingsHeader from "./components/Header";
import SettingsContent from "./components/Content";

const meta = {
  title: "Настройки",
  description: "Настройки приложения",
};

const SettingsPage = () => {
  return (
    <IonPage>
      <SettingsHeader title={meta.title} />
      <SettingsContent title={meta.title} />
    </IonPage>
  );
};

export default SettingsPage;
