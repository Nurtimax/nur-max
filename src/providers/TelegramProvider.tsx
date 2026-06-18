import { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const data = JSON.stringify({
  eventType: "web_app_request_fullscreen",
});

window.parent.postMessage(data, "https://web.telegram.org");

const TelegramProvider: FC<IProps> = ({ children }) => {
  return <>{children}</>;
};

export default TelegramProvider;
