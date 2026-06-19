/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, useEffect } from "react";
import { useSettings } from "../store/settings.store";

interface IProps {
  children: ReactNode;
}
const ThemeProvider: FC<IProps> = ({ children }) => {
  const darkMode = useSettings((state) => state.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("ion-palette-dark", darkMode);
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
