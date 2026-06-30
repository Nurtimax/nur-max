import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import {} from "@telegram-apps/sdk-react";
import { useTelegramFullscreen } from "../../../hooks/useTelegramFullscreen";
import { useLanguageStore } from "../../../store/language.store";

const SettingsHeader: FC = () => {
  const { platform } = useTelegramFullscreen();

  const languageState = useLanguageStore((state) => state.state);

  return (
    <IonHeader translucent={true}>
      {platform === "android" && <IonToolbar />}
      <IonToolbar>
        <IonTitle>{languageState.pages.settings.title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default SettingsHeader;
