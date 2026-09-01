import { IonContent } from "@ionic/react";
import { checkmarkCircle, restaurantOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import MealCard from "../../../components/meals/MealCard";
import BudgetCard from "../../../components/budget/BudgetCard";
import DayStrip from "../../../components/meals/DayStrip";
import ProgressRing from "../../../components/meals/ProgressRing";
import { useFoodsStore } from "../../../store/foods.store";
import { useUserStore } from "../../../store/user.store";
import { IMealAction, MealDay } from "../../../@types/meal.types";
import { useLanguageStore } from "../../../store/language.store";
import {
  getDateLabel,
  getGreeting,
  getWeekLabel,
  getWeekdayLabel,
} from "../../../utils/constants/language/index.constant";
import {
  countCompleted,
  countTotal,
  getTodayNumber,
  getWeekIndexByDay,
  groupIntoWeeks,
} from "../../../utils/helpers/week.helper";
import classes from "../page.module.css";

const HomeContent: FC = () => {
  const today = getTodayNumber();
  const history = useHistory();

  const foods = useFoodsStore((state) => state.foods);
  const toggleFoodsComplete = useFoodsStore(
    (state) => state.toggleFoodsComplete,
  );

  const language = useLanguageStore((state) => state.language);
  const languageState = useLanguageStore((state) => state.state);
  const userName = useUserStore((state) => state.user?.name);
  const t = languageState.pages.home;

  const weeks = useMemo(() => groupIntoWeeks(foods), [foods]);
  const currentWeek = weeks[getWeekIndexByDay(today)] ?? weeks[0];

  const [selectedDay, setSelectedDay] = useState(today);

  // Планга бүгүнкү күн жок болсо (мис. кыска ай) — аптадагы биринчи күн
  useEffect(() => {
    const days = currentWeek?.days ?? [];
    if (days.length && !days.some((day) => day.day === selectedDay)) {
      setSelectedDay(days[0].day);
    }
  }, [currentWeek, selectedDay]);

  const selected = currentWeek?.days.find((day) => day.day === selectedDay);
  const todayMeal = foods.find((food) => food.day === today);
  const done = countCompleted(todayMeal);
  const total = countTotal(todayMeal);

  const updateComplete = (data: MealDay, action: IMealAction) => {
    toggleFoodsComplete(data.day, action.key);
  };

  return (
    <IonContent fullscreen>
      <div className={classes.content}>
        <section className={classes.hero}>
          <div className={classes.heroTop}>
            <div>
              <p className={classes.heroGreeting}>{getGreeting(language)}</p>
              <h1 className={classes.heroName}>{userName || "NUR MAX"}</h1>
              <p className={classes.heroDate}>
                {getWeekdayLabel(today, language)}, {getDateLabel(today, language)}
              </p>
            </div>

            <div className={classes.heroRing}>
              <ProgressRing
                value={done}
                total={total}
                size={68}
                stroke={6}
                variant="inverse"
              />
            </div>
          </div>

          <div className={classes.heroFooter}>
            <IonIcon
              icon={total > 0 && done === total ? checkmarkCircle : restaurantOutline}
            />
            <span>
              {total > 0 && done === total
                ? t.all_done
                : `${done}/${total} ${t.meals_done}`}
            </span>
          </div>
        </section>

        <BudgetCard onOpenDetails={() => history.push("/budget")} />

        {currentWeek && (
          <>
            <div className={classes.section}>
              <h2 className={classes.sectionTitle}>
                {t.this_week} · {getWeekLabel(currentWeek.index, language)}
              </h2>
              <button
                type="button"
                className={classes.sectionLink}
                onClick={() => history.push("/foods")}
              >
                {t.open_week}
              </button>
            </div>

            <DayStrip
              days={currentWeek.days}
              activeDay={selectedDay}
              onSelect={setSelectedDay}
              language={language}
            />
          </>
        )}

        {selected ? (
          <div className={classes.dayWrapper}>
            <MealCard
              data={selected}
              updateComplete={updateComplete}
              language={language}
              state={languageState.meal_card}
            />
          </div>
        ) : (
          <p className={classes.empty}>{t.empty}</p>
        )}
      </div>
    </IonContent>
  );
};

export default HomeContent;
