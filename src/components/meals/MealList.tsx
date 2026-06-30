import React, { FC } from "react";
import MealCard from "./MealCard";
import { IMealAction, MealDay } from "../../@types/meal.types";
import { useFoodsStore } from "../../store/foods.store";
import { useLanguageStore } from "../../store/language.store";

interface IProps {
  list?: MealDay[];
}
const HomeMealList: FC<IProps> = ({ list }) => {
  const toggleFoodsComplete = useFoodsStore(
    (state) => state.toggleFoodsComplete,
  );

  const updateComplete = (data: MealDay, action: IMealAction) => {
    toggleFoodsComplete(data.day, action.key);
  };

  const language = useLanguageStore((state) => state.language);
  const languageState = useLanguageStore((state) => state.state);

  return (
    <div className="ion-padding-top">
      {list?.map((meal) => (
        <MealCard
          key={meal.day}
          data={meal}
          updateComplete={updateComplete}
          language={language}
          state={languageState.meal_card}
        />
      ))}
    </div>
  );
};

export default HomeMealList;
