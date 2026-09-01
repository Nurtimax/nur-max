import { IonPage } from "@ionic/react";
import ProfileContent from "./components/Content";
import AppHeader from "../../components/layout/AppHeader";
import { useLanguageStore } from "../../store/language.store";

const ProfilePage = () => {
  const languageState = useLanguageStore((state) => state.state);

  return (
    <IonPage>
      <AppHeader title={languageState.pages.profile.title} />
      <ProfileContent />
    </IonPage>
  );
};

export default ProfilePage;
