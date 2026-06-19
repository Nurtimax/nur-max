import { IonContent } from "@ionic/react";
import ProfileContentForm from "./ContentForm";
import classes from "../page.module.css";
import ProfileContentAvatar from "./ContentAvatar";

const ProfileContent = () => {
  return (
    <IonContent fullscreen>
      <ProfileContentAvatar />

      <div className={classes.profileContentForm}>
        <ProfileContentForm />
      </div>
    </IonContent>
  );
};

export default ProfileContent;
