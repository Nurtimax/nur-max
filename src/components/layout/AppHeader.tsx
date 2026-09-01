import { IonHeader, IonToolbar } from "@ionic/react";
import { FC, ReactNode } from "react";
import { useTelegramFullscreen } from "../../hooks/useTelegramFullscreen";
import classes from "./AppHeader.module.css";

interface IProps {
  title?: string;
  subtitle?: string;
  end?: ReactNode;
}

/**
 * Бардык беттерге жалпы хедер.
 * Telegram fullscreen режиминде системанын жана Telegram'дын
 * коопсуз аймактарын эсепке алат.
 */
const AppHeader: FC<IProps> = ({ title, subtitle, end }) => {
  const { isFullscreen } = useTelegramFullscreen();

  return (
    <IonHeader translucent className={classes.header}>
      <IonToolbar
        className={`${classes.toolbar} ${isFullscreen ? classes.fullscreen : ""}`}
      >
        <div className={classes.inner}>
          <div className={classes.text}>
            {title && <h1 className={classes.title}>{title}</h1>}
            {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
          </div>
          {end && <div className={classes.end}>{end}</div>}
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
