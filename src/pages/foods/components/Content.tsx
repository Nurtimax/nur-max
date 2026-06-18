import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import HomeMealList from "../../../components/meals/MealList";
import { useFoodsStore } from "../../../store/foods.store";
import { FC } from "react";

interface IProps {
  title: string;
}
const FoodsContent: FC<IProps> = ({ title }) => {
  const foods = useFoodsStore((state) => state.foods);

  return (
    <IonContent>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <HomeMealList list={foods} />
    </IonContent>
  );
};

export default FoodsContent;
