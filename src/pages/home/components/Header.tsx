import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";

interface IProps {
  title: string;
}
const HomeHeader: FC<IProps> = ({ title }) => {
  const { platform } = useTelegramFullscreen();
  return (
    <IonHeader translucent={true}>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default HomeHeader;
