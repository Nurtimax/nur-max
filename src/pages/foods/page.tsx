import { IonPage } from "@ionic/react";
import FoodsContent from "./components/Content";
import FoodsHeader from "./components/Header";
import { useLanguageStore } from "../../store/language.store";

const FoodsPage = () => {
  const languageState = useLanguageStore((state) => state.state);

  const title = languageState.pages.food.food_list;

  return (
    <IonPage>
      <FoodsHeader title={title} />
      <FoodsContent title={title} />
    </IonPage>
  );
};

export default FoodsPage;
