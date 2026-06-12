import { IonAvatar } from "@ionic/react";
import classes from "../page.module.css";
import { useUserStore } from "../../../store/user.store";

const ProfileContentAvatar = () => {
  const photoUrl = useUserStore((state) => state.user?.photoUrl);

  return (
    <div className={classes.profileContainer}>
      {photoUrl && (
        <div className={classes.avatarBackground}>
          <img src={photoUrl} alt="" />
        </div>
      )}

      <IonAvatar className={classes.avatar}>
        <img
          alt="Silhouette of a person's head"
          src={
            photoUrl || "https://ionicframework.com/docs/img/demos/avatar.svg"
          }
        />
      </IonAvatar>
    </div>
  );
};

export default ProfileContentAvatar;
