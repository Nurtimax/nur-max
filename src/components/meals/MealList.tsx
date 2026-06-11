import React, { FC } from "react";
import MealCard from "./MealCard";
import { MealDay } from "../../@types/meal.types";
import { useMutation } from "@tanstack/react-query";
import { updateFoods } from "../../query/foods.query";

interface IProps {
  list?: MealDay[];
}
const HomeMealList: FC<IProps> = ({ list }) => {
  const mutation = useMutation({ mutationFn: updateFoods });

  const updateComplete = (data: MealDay) => {
    const mapedList = list?.map((item) =>
      item.day === data.day ? data : item,
    );
    mutation.mutate({ list: mapedList });
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
