import { IonContent } from "@ionic/react";
import ContentTitle from "./ContentTitle";
import MealCard from "../../../components/meals/MealCard";
import { useFoodsStore } from "../../../store/foods.store";
import { IMealAction, MealDay } from "../../../@types/meal.types";
import { FC } from "react";
import { useLanguageStore } from "../../../store/language.store";

interface IProps {
  title: string;
}
const HomeContent: FC<IProps> = ({ title }) => {
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

  const language = useLanguageStore((state) => state.language);

  const languageState = useLanguageStore((state) => state.state);

  return (
    <IonContent fullscreen>
      <ContentTitle title={title} />

      {findFood && (
        <MealCard
          data={findFood}
          updateComplete={updateComplete}
          language={language}
          state={languageState.meal_card}
        />
      )}
    </IonContent>
  );
};

export default HomeContent;
