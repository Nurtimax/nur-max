import { IonCardSubtitle, IonContent } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { getFoods } from "../../../query/foods.query";
import HomeMealList from "./MealList";

const HomeContent = () => {
  const { data } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
    initialData: null,
    retry: 2,
  });

  return (
    <IonContent className="" fullscreen>
      <div className="ion-padding-horizontal ion-padding-top">
        <IonCardSubtitle>🍽 30 күндүк тамактануу планы</IonCardSubtitle>
      </div>

      <HomeMealList list={data?.list} />
    </IonContent>
  );
};

export default HomeContent;
