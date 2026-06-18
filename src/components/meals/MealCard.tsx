import {
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
} from "@ionic/react";
import { FC } from "react";
import { trash } from "ionicons/icons";
import { IMealAction, MealDay } from "../../@types/meal.types";
import classes from "./index.module.css";
import { FOOD_ACTIONS } from "../../utils/constants/meal-card.constant";

interface IProps {
  data: MealDay;
  updateComplete?: (data: MealDay, action: IMealAction) => void;
}

const MealCard: FC<IProps> = ({ data, updateComplete }) => {
  const handleCheckboxClick = async (action: IMealAction) => {
    updateComplete?.(data, action);
  };

  return (
    <IonList inset className={classes.list}>
      <IonItemDivider>
        <IonLabel>{data.day}-күн</IonLabel>
      </IonItemDivider>

      {FOOD_ACTIONS.map((action) => (
        <IonItemSliding>
          <IonItem
            button
            className={classes.ionItem}
            disabled={data[action.key]?.complete}
          >
            <IonIcon icon={action.icon} color={action.color} />
            <IonLabel className={classes.ionLabel}>
              <p>{action.title}</p>
              <h2 style={{ margin: 0 }}>{data[action.key].name}</h2>
            </IonLabel>
          </IonItem>
          <IonItemOptions slot="end">
            <IonItemOption
              color="light"
              expandable={true}
              onClick={() => handleCheckboxClick(action)}
            >
              <IonIcon
                slot="icon-only"
                color={data[action.key]?.complete ? "success" : "danger"}
                icon={trash}
              ></IonIcon>
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </IonList>
  );
};

export default MealCard;
