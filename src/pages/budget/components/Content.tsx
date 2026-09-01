import { IonContent, IonIcon } from "@ionic/react";
import { addOutline, walletOutline } from "ionicons/icons";
import { FC, useEffect, useMemo, useState } from "react";
import BudgetBar from "../../../components/budget/BudgetBar";
import ExpenseList from "../../../components/budget/ExpenseList";
import WeekTabs from "../../../components/meals/WeekTabs";
import { useBudgetStore } from "../../../store/budget.store";
import { useExpenseSheet } from "../../../store/expense-sheet.store";
import { useLanguageStore } from "../../../store/language.store";
import {
  formatMoney,
  getBudgetWeeks,
  getDayBudget,
  getExpensesByDate,
  getMonthSpent,
} from "../../../utils/helpers/budget.helper";
import {
  getTodayNumber,
  getWeekIndexByDay,
  getWeekPlanPrice,
  groupIntoWeeks,
} from "../../../utils/helpers/week.helper";
import { useFoodsStore } from "../../../store/foods.store";
import {
  getDateLabel,
  getWeekLabel,
  getWeekdayLabel,
} from "../../../utils/constants/language/index.constant";
import { haptic, hapticSelection } from "../../../utils/helpers/telegram.helper";
import classes from "../page.module.css";

const BudgetContent: FC = () => {
  const today = getTodayNumber();

  const expenses = useBudgetStore((state) => state.expenses);
  const dailyLimit = useBudgetStore((state) => state.dailyLimit);
  const openSheet = useExpenseSheet((state) => state.open);

  const language = useLanguageStore((state) => state.language);
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.budget;
  const currency = languageState.common.currency;

  const weeks = useMemo(
    () => getBudgetWeeks(expenses, dailyLimit),
    [expenses, dailyLimit],
  );

  const foods = useFoodsStore((state) => state.foods);
  const mealWeeks = useMemo(() => groupIntoWeeks(foods), [foods]);

  const todayWeekIndex = getWeekIndexByDay(today);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(todayWeekIndex, Math.max(0, weeks.length - 1)),
  );
  const [selectedDay, setSelectedDay] = useState(today);

  const activeWeek = weeks[Math.min(activeIndex, weeks.length - 1)];

  // Башка аптага өткөндө тандалган күн ошол аптанын ичинде болушу керек
  useEffect(() => {
    const days = activeWeek?.days ?? [];
    if (days.length && !days.some((day) => day.day === selectedDay)) {
      setSelectedDay(days[0].day);
    }
  }, [activeWeek, selectedDay]);

  const monthSpent = getMonthSpent(expenses);
  const todayBudget = getDayBudget(today, expenses, dailyLimit);
  const monthDays = new Date().getDate();
  const avgPerDay = monthDays > 0 ? Math.round(monthSpent / monthDays) : 0;
  const planPrice = getWeekPlanPrice(
    mealWeeks[activeIndex]?.days ?? [],
  );
  const dayExpenses = getExpensesByDate(
    expenses,
    activeWeek?.days.find((day) => day.day === selectedDay)?.date ?? "",
  );

  return (
    <IonContent fullscreen>
      <div className={classes.content}>
        <section className={classes.summary}>
          <div className={classes.summaryTop}>
            <div>
              <p className={classes.summaryLabel}>{t.week_spent}</p>
              <p className={classes.summaryValue}>
                {formatMoney(activeWeek?.spent ?? 0, currency)}
              </p>
              <p className={classes.summaryLimit}>
                / {formatMoney(activeWeek?.limit ?? 0, currency)}
              </p>
            </div>

            <button
              type="button"
              className={classes.summaryAdd}
              onClick={() => {
                haptic("medium");
                openSheet({ day: selectedDay });
              }}
            >
              <IonIcon icon={addOutline} />
              {t.add}
            </button>
          </div>

          <BudgetBar
            percent={activeWeek?.percent ?? 0}
            isOver={(activeWeek?.spent ?? 0) > (activeWeek?.limit ?? 0)}
            variant="inverse"
          />

          <p className={classes.summaryFooter}>
            <IonIcon icon={walletOutline} />
            {activeWeek?.percent ?? 0}% {t.of_limit}
            {planPrice > 0 && (
              <> · {t.plan}: {formatMoney(planPrice, currency)}</>
            )}
          </p>
        </section>

        <div className={classes.stats}>
          <div className={classes.stat}>
            <p className={classes.statLabel}>{t.today}</p>
            <p
              className={`${classes.statValue} ${
                todayBudget.isOver ? classes.statValueOver : ""
              }`}
            >
              {formatMoney(todayBudget.spent, currency)}
            </p>
            <p className={classes.statHint}>
              / {formatMoney(dailyLimit, currency)}
            </p>
          </div>

          <div className={classes.stat}>
            <p className={classes.statLabel}>{t.month_spent}</p>
            <p className={classes.statValue}>
              {formatMoney(monthSpent, currency)}
            </p>
            <p className={classes.statHint}>
              {t.avg_day}: {formatMoney(avgPerDay, currency)}
            </p>
          </div>
        </div>

        <WeekTabs
          weeks={weeks}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          language={language}
          todayWeekIndex={todayWeekIndex}
          percentOf={(index) => weeks[index]?.percent ?? 0}
        />

        <h2 className={classes.weekTitle}>
          {getWeekLabel(activeWeek?.index ?? 0, language)}
        </h2>

        <div className={classes.days}>
          {activeWeek?.days.map((day) => (
            <button
              key={day.day}
              type="button"
              className={`${classes.day} ${
                day.day === selectedDay ? classes.dayActive : ""
              }`}
              onClick={() => {
                hapticSelection();
                setSelectedDay(day.day);
              }}
            >
              <span className={classes.dayNumber}>{day.day}</span>
              <span className={classes.dayText}>
                <span className={classes.dayWeekday}>
                  {getWeekdayLabel(day.day, language)}
                  {day.day === today && <span className={classes.dayToday} />}
                </span>
                <BudgetBar percent={day.percent} isOver={day.isOver} />
              </span>
              <span
                className={`${classes.dayAmount} ${
                  day.isOver ? classes.dayAmountOver : ""
                }`}
              >
                {formatMoney(day.spent, currency)}
              </span>
            </button>
          ))}
        </div>

        <div className={classes.dayDetails}>
          <div className={classes.dayDetailsHead}>
            <h3 className={classes.dayDetailsTitle}>{t.day_expenses}</h3>
            <span className={classes.dayDetailsDate}>
              {getDateLabel(selectedDay, language)}
            </span>
          </div>
          <ExpenseList expenses={dayExpenses} />
        </div>
      </div>
    </IonContent>
  );
};

export default BudgetContent;
