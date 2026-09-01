import { IonIcon } from "@ionic/react";
import { addOutline, walletOutline, warningOutline } from "ionicons/icons";
import { FC } from "react";
import { useBudgetStore } from "../../store/budget.store";
import { useExpenseSheet } from "../../store/expense-sheet.store";
import { useLanguageStore } from "../../store/language.store";
import {
  formatMoney,
  getBudgetWeeks,
  getDayBudget,
  getMonthSpent,
} from "../../utils/helpers/budget.helper";
import {
  getTodayNumber,
  getWeekIndexByDay,
} from "../../utils/helpers/week.helper";
import { haptic } from "../../utils/helpers/telegram.helper";
import BudgetBar from "./BudgetBar";
import classes from "./index.module.css";

interface IProps {
  onOpenDetails?: () => void;
}

/** Башкы беттеги бүгүнкү бюджет картасы */
const BudgetCard: FC<IProps> = ({ onOpenDetails }) => {
  const expenses = useBudgetStore((state) => state.expenses);
  const dailyLimit = useBudgetStore((state) => state.dailyLimit);
  const openSheet = useExpenseSheet((state) => state.open);

  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.budget;
  const currency = languageState.common.currency;

  const today = getTodayNumber();
  const budget = getDayBudget(today, expenses, dailyLimit);
  const week = getBudgetWeeks(expenses, dailyLimit)[getWeekIndexByDay(today)];
  const monthSpent = getMonthSpent(expenses);

  return (
    <section className={classes.card}>
      <header className={classes.cardHead}>
        <button
          type="button"
          className={classes.cardHeadMain}
          onClick={onOpenDetails}
        >
          <span className={classes.cardIcon}>
            <IonIcon icon={walletOutline} />
          </span>
          <span className={classes.cardHeadText}>
            <span className={classes.cardLabel}>{t.today}</span>
            <span className={classes.cardValue}>
              {formatMoney(budget.spent, currency)}
              <span className={classes.cardLimit}>
                {" "}
                / {formatMoney(budget.limit, currency)}
              </span>
            </span>
          </span>
        </button>

        <button
          type="button"
          className={classes.addButton}
          onClick={() => {
            haptic("medium");
            openSheet();
          }}
          aria-label={t.add}
        >
          <IonIcon icon={addOutline} />
        </button>
      </header>

      <BudgetBar percent={budget.percent} isOver={budget.isOver} />

      <p className={classes.cardTotals}>
        <span>
          {t.week_spent}: <b>{formatMoney(week?.spent ?? 0, currency)}</b>
        </span>
        <span>
          {t.month_spent}: <b>{formatMoney(monthSpent, currency)}</b>
        </span>
      </p>

      <p
        className={`${classes.cardFooter} ${
          budget.isOver ? classes.cardFooterOver : ""
        }`}
      >
        {budget.isOver ? (
          <>
            <IonIcon icon={warningOutline} />
            {t.over_by}: {formatMoney(Math.abs(budget.left), currency)}
          </>
        ) : (
          <>
            {t.left}: <b>{formatMoney(budget.left, currency)}</b>
          </>
        )}
      </p>
    </section>
  );
};

export default BudgetCard;
