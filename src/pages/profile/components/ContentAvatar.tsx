import { IonAvatar } from "@ionic/react";
import classes from "../page.module.css";
import { useUserStore } from "../../../store/user.store";

const FALLBACK_AVATAR = "https://ionicframework.com/docs/img/demos/avatar.svg";

const ProfileContentAvatar = () => {
  const user = useUserStore((state) => state.user);
  const photoUrl = user?.photoUrl;

  return (
    <div className={classes.profileContainer}>
      {photoUrl && (
        <div className={classes.avatarBackground}>
          <img src={photoUrl} alt="" />
        </div>
      )}

      <div className={classes.avatarBackgroundContainer}>
        <IonAvatar className={classes.avatar}>
          <img alt="" src={photoUrl || FALLBACK_AVATAR} />
        </IonAvatar>
        {user?.name && <h2 className={classes.name}>{user.name}</h2>}
        {user?.email && <p className={classes.email}>{user.email}</p>}
      </div>
    </div>
  );
};

export default ProfileContentAvatar;
