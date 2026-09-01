import { FC, useMemo, useState } from "react";
import MealCard from "./MealCard";
import WeekTabs from "./WeekTabs";
import { IMealAction, MealDay } from "../../@types/meal.types";
import { useFoodsStore } from "../../store/foods.store";
import { useLanguageStore } from "../../store/language.store";
import {
  getWeekLabel,
} from "../../utils/constants/language/index.constant";
import {
  getTodayNumber,
  getWeekIndexByDay,
  getWeekProgress,
  groupIntoWeeks,
} from "../../utils/helpers/week.helper";
import classes from "./index.module.css";

interface IProps {
  list?: MealDay[];
}

/** Планды 7 күндүк апталарга бөлүп көрсөтөт */
const MealWeekList: FC<IProps> = ({ list }) => {
  const toggleFoodsComplete = useFoodsStore(
    (state) => state.toggleFoodsComplete,
  );

  const language = useLanguageStore((state) => state.language);
  const languageState = useLanguageStore((state) => state.state);
  const t = languageState.pages.food;

  const weeks = useMemo(() => groupIntoWeeks(list ?? []), [list]);
  const todayWeekIndex = getWeekIndexByDay(getTodayNumber());

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(todayWeekIndex, Math.max(0, weeks.length - 1)),
  );

  const activeWeek = weeks[Math.min(activeIndex, weeks.length - 1)];
  const progress = getWeekProgress(activeWeek);

  const updateComplete = (data: MealDay, action: IMealAction) => {
    toggleFoodsComplete(data.day, action.key);
  };

  if (!weeks.length) {
    return <p className={classes.empty}>{t.empty}</p>;
  }

  return (
    <div className={classes.weeks}>
      <WeekTabs
        weeks={weeks}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        language={language}
        todayWeekIndex={todayWeekIndex}
        percentOf={(index) => getWeekProgress(weeks[index]).percent}
      />

      <div className={classes.weekSummary}>
        <h2 className={classes.weekTitle}>
          {getWeekLabel(activeWeek.index, language)}
        </h2>
        <span className={classes.weekCount}>
          {progress.done}/{progress.total} · {progress.percent}%
        </span>
      </div>

      <div className={classes.cards}>
        {activeWeek.days.map((meal) => (
          <MealCard
            key={meal.day}
            data={meal}
            updateComplete={updateComplete}
            language={language}
            state={languageState.meal_card}
            collapsible
            defaultOpen={meal.day === getTodayNumber()}
          />
        ))}
      </div>
    </div>
  );
};

export default MealWeekList;
