import { IonPage } from "@ionic/react";
import HomeContent from "./components/Content";
import HomeHeader from "./components/Header";

const meta = {
  title: "NUR MAX",
};
const HomePage = () => {
  return (
    <IonPage>
      <HomeHeader title={meta.title} />
      <HomeContent title={meta.title} />
    </IonPage>
  );
};

export default HomePage;
