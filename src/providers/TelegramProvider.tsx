import { FC, ReactNode, useEffect } from "react";
import { useTelegramFullscreen } from "../hooks/useTelegramFullscreen";

interface IProps {
  children: ReactNode;
}

const TelegramProvider: FC<IProps> = ({ children }) => {
  const { toggleFullscreen } = useTelegramFullscreen();

  useEffect(() => {
    toggleFullscreen();
  }, [toggleFullscreen]);

  return <>{children}</>;
};

export default TelegramProvider;
