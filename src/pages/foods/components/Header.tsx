import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";

interface IProps {
  title: string;
}

const FoodsHeader: FC<IProps> = ({ title }) => {
  const { platform, isFullscreen } = useTelegramFullscreen();

  return (
    <IonHeader translucent={true}>
      {(platform === "android" || isFullscreen) && <IonToolbar />}
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default FoodsHeader;
