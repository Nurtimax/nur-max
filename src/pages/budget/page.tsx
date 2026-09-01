import { IonPage } from "@ionic/react";
import BudgetContent from "./components/Content";
import AppHeader from "../../components/layout/AppHeader";
import { useLanguageStore } from "../../store/language.store";

const BudgetPage = () => {
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.budget;

  return (
    <IonPage>
      <AppHeader title={t.title} subtitle={t.subtitle} />
      <BudgetContent />
    </IonPage>
  );
};

export default BudgetPage;
