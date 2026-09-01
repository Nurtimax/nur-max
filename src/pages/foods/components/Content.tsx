import { IonContent } from "@ionic/react";
import { FC } from "react";
import MealWeekList from "../../../components/meals/MealList";
import { useFoodsStore } from "../../../store/foods.store";
import classes from "../page.module.css";

const FoodsContent: FC = () => {
  const foods = useFoodsStore((state) => state.foods);

  return (
    <IonContent fullscreen>
      <div className={classes.content}>
        <MealWeekList list={foods} />
      </div>
    </IonContent>
  );
};

export default FoodsContent;
