import { IonContent } from "@ionic/react";
import ProfileContentForm from "./ContentForm";
import ProfileContentAvatar from "./ContentAvatar";

const ProfileContent = () => {
  return (
    <IonContent>
      <ProfileContentAvatar />

      <div className="ion-padding">
        <ProfileContentForm />
      </div>
    </IonContent>
  );
};

export default ProfileContent;
