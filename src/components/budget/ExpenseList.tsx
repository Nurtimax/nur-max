import { IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { FC } from "react";
import { Expense } from "../../@types/budget.types";
import { useBudgetStore } from "../../store/budget.store";
import { useLanguageStore } from "../../store/language.store";
import { getCategoryMeta } from "../../utils/constants/budget.constant";
import { formatMoney } from "../../utils/helpers/budget.helper";
import { haptic } from "../../utils/helpers/telegram.helper";
import classes from "./index.module.css";

interface IProps {
  expenses: Expense[];
}

const ExpenseList: FC<IProps> = ({ expenses }) => {
  const removeExpense = useBudgetStore((state) => state.removeExpense);

  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.budget;
  const currency = languageState.common.currency;

  if (!expenses.length) {
    return <p className={classes.empty}>{t.empty}</p>;
  }

  return (
    <ul className={classes.list}>
      {expenses.map((expense) => {
        const meta = getCategoryMeta(expense.category, languageState);

        return (
          <li key={expense.id} className={classes.listItem}>
            <span
              className={classes.listIcon}
              style={{ ["--cat-accent" as string]: meta.accent }}
            >
              <IonIcon icon={meta.icon} />
            </span>

            <span className={classes.listText}>
              <span className={classes.listTitle}>{meta.title}</span>
              {expense.note && (
                <span className={classes.listNote}>{expense.note}</span>
              )}
            </span>

            <span className={classes.listAmount}>
              {formatMoney(expense.amount, currency)}
            </span>

            <button
              type="button"
              className={classes.listDelete}
              onClick={() => {
                haptic("medium");
                removeExpense(expense.id);
              }}
              aria-label={t.delete}
            >
              <IonIcon icon={trashOutline} />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ExpenseList;
