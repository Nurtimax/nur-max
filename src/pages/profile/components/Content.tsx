import { IonContent, IonToolbar } from "@ionic/react";
import ProfileContentForm from "./ContentForm";
import ProfileContentAvatar from "./ContentAvatar";
import classes from "../page.module.css";

const ProfileContent = () => {
  return (
    <IonContent>
      <IonToolbar class={classes.toolbar} />

      <ProfileContentAvatar />

      <div className={classes.profileContentForm}>
        <ProfileContentForm />
      </div>
    </IonContent>
  );
};

export default ProfileContent;
