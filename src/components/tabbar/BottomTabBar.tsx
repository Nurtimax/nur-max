import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import { home, people, pizza, settings } from "ionicons/icons";
import { useLanguageStore } from "../../store/language.store";

const BottomTabBar = () => {
  const languageState = useLanguageStore((state) => state.state);

  const pages = languageState.pages;
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon aria-hidden="true" icon={home} />
        <IonLabel>{pages.home.title}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="foods" href="/foods">
        <IonIcon aria-hidden="true" icon={pizza} />
        <IonLabel>{pages.food.title}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        <IonIcon aria-hidden="true" icon={people} />
        <IonLabel>{pages.profile.title}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/settings">
        <IonIcon aria-hidden="true" icon={settings} />
        <IonLabel>{pages.settings.title}</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default BottomTabBar;
