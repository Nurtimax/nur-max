import { IonCardSubtitle, IonContent, IonToolbar } from "@ionic/react";
import HomeMealList from "../../../components/meals/MealList";
import { useFoodsStore } from "../../../store/foods.store";

const FoodsContent = () => {
  const foods = useFoodsStore((state) => state.foods);

  return (
    <IonContent>
      <IonToolbar />
      <div className="ion-padding-horizontal ion-padding-top">
        <IonCardSubtitle>🍽 30 күндүк тамактануу планы</IonCardSubtitle>
      </div>

      <HomeMealList list={foods} />
    </IonContent>
  );
};

export default FoodsContent;
