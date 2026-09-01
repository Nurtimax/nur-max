import { IonIcon } from "@ionic/react";
import { checkmark, refreshOutline } from "ionicons/icons";
import { FC, useEffect, useRef, useState } from "react";
import { IMealAction, MealDayAction } from "../../@types/meal.types";
import { ELanguage, ILanguagesStateMealCard } from "../../@types/language.type";
import { haptic, hapticSuccess } from "../../utils/helpers/telegram.helper";
import { useBudgetStore } from "../../store/budget.store";
import { useFoodsStore } from "../../store/foods.store";
import {
  dateKeyForDay,
  formatAmount,
} from "../../utils/helpers/budget.helper";
import { pickRandomMeal } from "../../utils/helpers/meal.helper";
import classes from "./index.module.css";

interface IProps {
  action: IMealAction;
  meal?: MealDayAction;
  /** Айдын күнү — сумма жана алмаштыруу ушул күнгө тиешелүү */
  day: number;
  language: ELanguage;
  state: ILanguagesStateMealCard;
  currency: string;
  onToggle?: (action: IMealAction) => void;
}

const MealRow: FC<IProps> = ({
  action,
  meal,
  day,
  language,
  state,
  currency,
  onToggle,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const catalog = useFoodsStore((store) => store.catalog);
  const replaceMeal = useFoodsStore((store) => store.replaceMeal);
  const setMealPrice = useFoodsStore((store) => store.setMealPrice);

  const setMealExpense = useBudgetStore((store) => store.setMealExpense);
  const removeMealExpense = useBudgetStore((store) => store.removeMealExpense);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  if (!meal) return null;

  const date = dateKeyForDay(day);

  const startEdit = () => {
    haptic("light");
    setDraft(meal.price ? `${meal.price}` : "");
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);

    const value = Number(draft.replace(",", "."));
    if (!Number.isFinite(value) || value < 0) return;

    setMealPrice(day, action.key, value);
    // Тамак белгиленген болсо — чыгым да жаңы суммага жаңырат
    if (meal.complete) {
      setMealExpense({
        date,
        key: action.key,
        amount: value,
        note: meal.name[language],
      });
    }
  };

  const handleToggleComplete = () => {
    if (meal.complete) {
      haptic("light");
      removeMealExpense(date, action.key);
    } else {
      hapticSuccess();
      // "Жедим" деп белгилегенде сумма автоматтык түрдө чыгымга жазылат
      setMealExpense({
        date,
        key: action.key,
        amount: meal.price,
        note: meal.name[language],
      });
    }
    onToggle?.(action);
  };

  // Тамак жок болсо — кокустан башкасына алмаштырабыз
  const handleReplace = () => {
    const next = pickRandomMeal(catalog?.[action.key], meal.name.kg);
    if (!next) return;

    haptic("medium");
    replaceMeal(day, action.key, next);

    if (meal.complete) {
      setMealExpense({
        date,
        key: action.key,
        amount: next.price,
        note: next.name[language],
      });
    }
  };

  return (
    <div
      className={`${classes.row} ${meal.complete ? classes.rowDone : ""}`}
      style={{ ["--row-accent" as string]: action.accent }}
    >
      <span className={classes.rowIcon}>
        <IonIcon icon={action.icon} />
      </span>

      <span className={classes.rowText}>
        <span className={classes.rowKind}>{action.title}</span>
        <span className={classes.rowName}>{meal.name[language]}</span>

        {editing ? (
          <span className={classes.rowPriceEdit}>
            <input
              ref={inputRef}
              className={classes.rowPriceInput}
              type="number"
              inputMode="numeric"
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitEdit}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") setEditing(false);
              }}
            />
            <span className={classes.rowPriceCurrency}>{currency}</span>
          </span>
        ) : (
          <button type="button" className={classes.rowPrice} onClick={startEdit}>
            {formatAmount(meal.price)} {currency}
          </button>
        )}
      </span>

      <button
        type="button"
        className={classes.rowReplace}
        onClick={handleReplace}
        aria-label={state.swap}
      >
        <IonIcon icon={refreshOutline} />
      </button>

      <button
        type="button"
        className={`${classes.check} ${meal.complete ? classes.checkDone : ""}`}
        onClick={handleToggleComplete}
        aria-label={meal.complete ? state.mark_undone : state.mark_done}
      >
        <IonIcon icon={checkmark} />
      </button>
    </div>
  );
};

export default MealRow;
