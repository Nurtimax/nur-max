import {
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  useIonToast,
} from "@ionic/react";
import { FC } from "react";
import { helpCircleOutline, trash } from "ionicons/icons";
import { IMealAction, MealDay } from "../../@types/meal.types";
import classes from "./index.module.css";
import { FOOD_ACTIONS } from "../../utils/constants/meal-card.constant";

interface IProps {
  data: MealDay;
  updateComplete?: (data: MealDay) => void;
}

const MealCard: FC<IProps> = ({ data, updateComplete }) => {
  const [present] = useIonToast();

  const handleCheckboxClick = async (action: IMealAction) => {
    if (updateComplete) {
      return updateComplete({
        ...data,
        [action.key]: {
          ...data[action.key],
          complete: !data[action.key].complete,
        },
      });
    }

    await present({
      message: "Ошибка при изменении статуса",
      duration: 3000,
      color: "danger",
      icon: helpCircleOutline,
      keyboardClose: true,
    });
  };

  return (
    <IonList inset className={classes.list}>
      <IonItemDivider>
        <IonLabel>{data.day}-күн</IonLabel>
      </IonItemDivider>

      {FOOD_ACTIONS.map((action) => (
        <IonItemSliding>
          <IonItem button className={classes.ionItem}>
            <IonIcon icon={action.icon} color={action.color} />
            <IonLabel className={classes.ionLabel}>
              <p>{action.title}</p>
              <h1 style={{ margin: 0 }}>{data[action.key].name}</h1>
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
                color={data[action.key].complete ? "success" : "danger"}
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
