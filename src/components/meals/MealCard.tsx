import { IonIcon } from "@ionic/react";
import { chevronDown } from "ionicons/icons";
import { FC, useState } from "react";
import { IMealAction, MealDay } from "../../@types/meal.types";
import { ELanguage, ILanguagesStateMealCard } from "../../@types/language.type";
import { getMealActions } from "../../utils/constants/meal-card.constant";
import {
  countCompleted,
  countTotal,
  getDayPlanPrice,
  getTodayNumber,
} from "../../utils/helpers/week.helper";
import {
  getDateLabel,
  getWeekdayLabel,
} from "../../utils/constants/language/index.constant";
import { haptic } from "../../utils/helpers/telegram.helper";
import { useLanguageStore } from "../../store/language.store";
import { useBudgetStore } from "../../store/budget.store";
import { formatMoney } from "../../utils/helpers/budget.helper";
import MealRow from "./MealRow";
import ProgressRing from "./ProgressRing";
import classes from "./index.module.css";

interface IProps {
  data: MealDay;
  updateComplete?: (data: MealDay, action: IMealAction) => void;
  language: ELanguage;
  state: ILanguagesStateMealCard;
  /** Аталышын басканда жыйылып-ачылабы */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const MealCard: FC<IProps> = ({
  data,
  updateComplete,
  language,
  state,
  collapsible = false,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const currency = useLanguageStore((store) => store.state.common.currency);
  const planLabel = useLanguageStore((store) => store.state.pages.budget.plan);
  const dailyLimit = useBudgetStore((store) => store.dailyLimit);

  const actions = getMealActions(state);
  const planPrice = getDayPlanPrice(data);
  const isOverLimit = dailyLimit > 0 && planPrice > dailyLimit;
  const done = countCompleted(data);
  const total = countTotal(data);
  const isToday = data.day === getTodayNumber();

  const handleHeaderClick = () => {
    if (!collapsible) return;
    haptic("soft");
    setOpen((prev) => !prev);
  };

  return (
    <section
      className={`${classes.card} ${isToday ? classes.cardToday : ""}`}
      aria-label={getWeekdayLabel(data.day, language)}
    >
      <header
        className={`${classes.cardHead} ${collapsible ? classes.cardHeadButton : ""}`}
        onClick={handleHeaderClick}
      >
        <div className={classes.cardDay}>
          <span className={classes.cardDayNumber}>{data.day}</span>
        </div>

        <div className={classes.cardHeadText}>
          <h2 className={classes.cardWeekday}>
            {getWeekdayLabel(data.day, language)}
          </h2>
          <p className={classes.cardDate}>
            {getDateLabel(data.day, language)}
            <span
              className={`${classes.cardPrice} ${
                isOverLimit ? classes.cardPriceOver : ""
              }`}
              title={planLabel}
            >
              {formatMoney(planPrice, currency)}
            </span>
          </p>
        </div>

        <ProgressRing value={done} total={total} size={46} stroke={5} />

        {collapsible && (
          <IonIcon
            icon={chevronDown}
            className={`${classes.cardChevron} ${open ? classes.cardChevronOpen : ""}`}
          />
        )}
      </header>

      {open && (
        <div className={classes.cardBody}>
          {actions.map((action) => (
            <MealRow
              key={action.key}
              action={action}
              meal={data[action.key]}
              day={data.day}
              language={language}
              state={state}
              currency={currency}
              onToggle={(meal) => updateComplete?.(data, meal)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MealCard;
