import { IonPage } from "@ionic/react";
import ProfileContent from "./components/Content";
import ProfileHeader from "./components/Header";

const ProfilePage = () => {
  return (
    <IonPage>
      <ProfileHeader />
      <ProfileContent />
    </IonPage>
  );
};

export default ProfilePage;
