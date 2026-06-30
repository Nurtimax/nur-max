import { IonPage } from "@ionic/react";
import SettingsHeader from "./components/Header";
import SettingsContent from "./components/Content";

const SettingsPage = () => {
  return (
    <IonPage>
      <SettingsHeader />
      <SettingsContent />
    </IonPage>
  );
};

export default SettingsPage;
