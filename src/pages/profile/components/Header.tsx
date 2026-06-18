import { IonHeader, IonToolbar } from "@ionic/react";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";

const ProfileHeader = () => {
  const { platform } = useTelegramFullscreen();

  return (
    <IonHeader translucent={true}>
      {platform === "android" && <IonToolbar />}
      <IonToolbar></IonToolbar>
    </IonHeader>
  );
};

export default ProfileHeader;
