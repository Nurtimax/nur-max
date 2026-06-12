import { IonButton, IonContent } from "@ionic/react";
import ContentTitle from "./ContentTitle";
import MealCard from "../../../components/meals/MealCard";
import { useFoodsStore } from "../../../store/foods.store";
import { IMealAction, MealDay } from "../../../@types/meal.types";

const HomeContent = () => {
  const now = new Date();
  const day = now.getDate();

  const foods = useFoodsStore((state) => state.foods);

  const findFood = foods.find((food) => food.day === day);

  const toggleFoodsComplete = useFoodsStore(
    (state) => state.toggleFoodsComplete,
  );

  const updateComplete = (data: MealDay, action: IMealAction) => {
    toggleFoodsComplete(data.day, action.key);
  };

  const handleOpen = () => {
    console.log("Open button clicked");
    console.log("👆 Кнопка нажата");
    window.Telegram?.WebApp?.requestFullscreen();
  };

  return (
    <IonContent fullscreen>
      <ContentTitle />

      <IonButton onClick={handleOpen}>Open</IonButton>

      {findFood && <MealCard data={findFood} updateComplete={updateComplete} />}
    </IonContent>
  );
};

export default HomeContent;
