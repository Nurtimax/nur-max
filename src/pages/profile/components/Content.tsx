import { IonContent } from "@ionic/react";
import ProfileContentForm from "./ContentForm";
import classes from "../page.module.css";
import ProfileContentAvatar from "./ContentAvatar";

const ProfileContent = () => (
  <IonContent fullscreen>
    <div className={classes.content}>
      <ProfileContentAvatar />
      <ProfileContentForm />
    </div>
  </IonContent>
);

export default ProfileContent;
