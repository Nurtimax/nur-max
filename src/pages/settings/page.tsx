import { IonPage } from "@ionic/react";
import SettingsContent from "./components/Content";
import AppHeader from "../../components/layout/AppHeader";
import { useLanguageStore } from "../../store/language.store";

const SettingsPage = () => {
  const languageState = useLanguageStore((state) => state.state);

  return (
    <IonPage>
      <AppHeader title={languageState.pages.settings.title} />
      <SettingsContent />
    </IonPage>
  );
};

export default SettingsPage;
