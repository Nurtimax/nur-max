import React, { FC } from "react";
import MealCard from "./MealCard";
import { IMealAction, MealDay } from "../../@types/meal.types";
import { useFoodsStore } from "../../store/foods.store";

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

  return (
    <div className="ion-padding-top">
      {list?.map((meal) => (
        <MealCard key={meal.day} data={meal} updateComplete={updateComplete} />
      ))}
    </div>
  );
};

export default HomeMealList;
