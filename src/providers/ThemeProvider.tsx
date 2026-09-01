import { FC, ReactNode, useEffect } from "react";
import { useSettings } from "../store/settings.store";
import { applyTelegramChrome } from "../utils/helpers/telegram.helper";

interface IProps {
  children: ReactNode;
}

const ThemeProvider: FC<IProps> = ({ children }) => {
  const darkMode = useSettings((state) => state.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("ion-palette-dark", darkMode);
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    applyTelegramChrome(darkMode);
  }, [darkMode]);

  return <>{children}</>;
};

export default ThemeProvider;
