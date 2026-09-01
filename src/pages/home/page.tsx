import { IonPage } from "@ionic/react";
import HomeContent from "./components/Content";
import AppHeader from "../../components/layout/AppHeader";

const HomePage = () => (
  <IonPage>
    <AppHeader title="NUR MAX" />
    <HomeContent />
  </IonPage>
);

export default HomePage;
