import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import {
  homeOutline,
  personOutline,
  restaurantOutline,
  settingsOutline,
  walletOutline,
} from "ionicons/icons";
import { useLanguageStore } from "../../store/language.store";
import { hapticSelection } from "../../utils/helpers/telegram.helper";

const BottomTabBar = () => {
  const languageState = useLanguageStore((state) => state.state);
  const pages = languageState.pages;

  const tabs = [
    { tab: "home", href: "/home", icon: homeOutline, label: pages.home.title },
    {
      tab: "foods",
      href: "/foods",
      icon: restaurantOutline,
      label: pages.food.title,
    },
    {
      tab: "budget",
      href: "/budget",
      icon: walletOutline,
      label: pages.budget.title,
    },
    {
      tab: "profile",
      href: "/profile",
      icon: personOutline,
      label: pages.profile.title,
    },
    {
      tab: "settings",
      href: "/settings",
      icon: settingsOutline,
      label: pages.settings.title,
    },
  ];

  return (
    <IonTabBar slot="bottom">
      {tabs.map((item) => (
        <IonTabButton
          key={item.tab}
          tab={item.tab}
          href={item.href}
          onClick={() => hapticSelection()}
        >
          <IonIcon aria-hidden="true" icon={item.icon} />
          <IonLabel>{item.label}</IonLabel>
        </IonTabButton>
      ))}
    </IonTabBar>
  );
};

export default BottomTabBar;
