import { IonContent } from "@ionic/react";
import ContentTitle from "./ContentTitle";
import { useQuery } from "@tanstack/react-query";
import { getFoods } from "../../../query/foods.query";
import MealCard from "../../../components/meals/MealCard";

const HomeContent = () => {
  const now = new Date();
  const day = now.getDate();

  const { data } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
    initialData: null,
    retry: 2,
  });

  const list = data?.list || [];

  const findFood = list.find((food) => food.day === day);

  console.log(findFood);

  return (
    <IonContent fullscreen>
      <ContentTitle />

      {findFood && <MealCard data={findFood} />}
    </IonContent>
  );
};

export default HomeContent;
