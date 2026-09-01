import { IonPage } from "@ionic/react";
import FoodsContent from "./components/Content";
import AppHeader from "../../components/layout/AppHeader";
import { useLanguageStore } from "../../store/language.store";

const FoodsPage = () => {
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.food;

  return (
    <IonPage>
      <AppHeader title={t.title} subtitle={t.food_list} />
      <FoodsContent />
    </IonPage>
  );
};

export default FoodsPage;
