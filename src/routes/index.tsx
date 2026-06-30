import { IonRouterOutlet, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import HomePage from "../pages/home/page";
import ProfilePage from "../pages/profile/page";
import FoodsPage from "../pages/foods/page";
import SettingsPage from "../pages/settings/page";
import BottomTabBar from "../components/tabbar/BottomTabBar";

const AppRouters = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/profile">
            <ProfilePage />
          </Route>
          <Route exact path="/foods">
            <FoodsPage />
          </Route>
          <Route exact path="/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <BottomTabBar />
      </IonTabs>
    </IonReactRouter>
  );
};

export default AppRouters;
