import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";

interface IProps {
  title: string;
}
const HomeHeader: FC<IProps> = ({ title }) => {
  return (
    <IonHeader translucent={true}>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default HomeHeader;
