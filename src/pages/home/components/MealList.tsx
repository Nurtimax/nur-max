import React, { FC } from "react";
import { MealDay } from "../../../@types/meal.types";
import MealCard from "./MealCard";

interface IProps {
  list?: MealDay[];
}
const HomeMealList: FC<IProps> = ({ list }) => {
  return (
    <div>
      {list?.map((meal) => (
        <MealCard key={meal.day} data={meal} />
      ))}
    </div>
  );
};

export default HomeMealList;
