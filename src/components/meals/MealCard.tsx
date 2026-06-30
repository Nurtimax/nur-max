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
import {
  leafOutline,
  moonOutline,
  pizza,
  restaurantOutline,
  sunnyOutline,
  trash,
} from "ionicons/icons";
import { IMealAction, MealDay } from "../../@types/meal.types";
import classes from "./index.module.css";
import { ELanguage, ILanguagesStateMealCard } from "../../@types/language.type";
import { getDayLabel } from "../../utils/constants/language/index.constant";

interface IProps {
  data: MealDay;
  updateComplete?: (data: MealDay, action: IMealAction) => void;
  language: ELanguage;
  state: ILanguagesStateMealCard;
}

const MealCard: FC<IProps> = ({ data, updateComplete, language, state }) => {
  const handleCheckboxClick = async (action: IMealAction) => {
    updateComplete?.(data, action);
  };

  const FOOD_ACTIONS: IMealAction[] = [
    {
      key: "breakfast",
      title: state.breakfast,
      icon: sunnyOutline,
      color: "warning",
    },
    {
      key: "lunch",
      title: state.lunch,
      icon: restaurantOutline,
      color: "primary",
    },
    { key: "dinner", title: state.dinner, icon: moonOutline, color: "dark" },
    { key: "snack", title: state.snack, icon: pizza, color: "secondary" },
    {
      key: "fruit",
      title: state.fruit,
      icon: leafOutline,
      color: "success",
    },
  ];

  console.log(FOOD_ACTIONS, "FOOD_ACTIONS", state, "state");

  return (
    <IonList inset className={classes.list}>
      <IonItemDivider>
        <IonLabel>{getDayLabel(data.day, language)}</IonLabel>
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
              <h2 style={{ margin: 0 }}>{data[action.key]?.name[language]}</h2>
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
