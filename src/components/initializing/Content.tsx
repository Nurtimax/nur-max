import { IonSpinner } from "@ionic/react";
import classes from "./index.module.css";

const InitializingContent = () => {
  return (
    <div className={classes.content}>
      <div className={classes.wrapper}>
        <IonSpinner name="circular"></IonSpinner>
      </div>
      <div className={classes.text}>
        <div className={classes.root}>
          <div className={classes.from}>from</div>
          <h2 className={classes.name}>Nurtimax</h2>
        </div>
      </div>
    </div>
  );
};

export default InitializingContent;
