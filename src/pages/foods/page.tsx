import { IonPage } from "@ionic/react";
import FoodsContent from "./components/Content";
import FoodsHeader from "./components/Header";

const meta = {
  title: "Список еды",
};

const FoodsPage = () => {
  return (
    <IonPage>
      <FoodsHeader title={meta.title} />
      <FoodsContent title={meta.title} />
    </IonPage>
  );
};

export default FoodsPage;
