import { IonHeader, IonToolbar } from "@ionic/react";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";

const ProfileHeader = () => {
  const { platform, isFullscreen } = useTelegramFullscreen();

  return (
    <IonHeader translucent={true}>
      {(platform === "android" || isFullscreen) && <IonToolbar />}
      <IonToolbar></IonToolbar>
    </IonHeader>
  );
};

export default ProfileHeader;
