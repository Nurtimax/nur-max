import { FC } from "react";
import { MealDay } from "../../@types/meal.types";
import { ELanguage } from "../../@types/language.type";
import { getWeekdayLabel } from "../../utils/constants/language/index.constant";
import {
  countCompleted,
  countTotal,
  getTodayNumber,
} from "../../utils/helpers/week.helper";
import { hapticSelection } from "../../utils/helpers/telegram.helper";
import classes from "./index.module.css";

interface IProps {
  days: MealDay[];
  activeDay: number;
  onSelect: (day: number) => void;
  language: ELanguage;
}

/** Аптанын 7 күнү — тегерек чиптер түрүндө */
const DayStrip: FC<IProps> = ({ days, activeDay, onSelect, language }) => {
  const today = getTodayNumber();

  return (
    <div className={classes.strip}>
      {days.map((day) => {
        const done = countCompleted(day);
        const total = countTotal(day);
        const isActive = day.day === activeDay;
        const isComplete = total > 0 && done === total;

        return (
          <button
            key={day.day}
            type="button"
            className={`${classes.stripItem} ${
              isActive ? classes.stripItemActive : ""
            }`}
            onClick={() => {
              hapticSelection();
              onSelect(day.day);
            }}
          >
            <span className={classes.stripWeekday}>
              {getWeekdayLabel(day.day, language, true)}
            </span>
            <span className={classes.stripDay}>{day.day}</span>
            <span
              className={`${classes.stripDot} ${
                isComplete ? classes.stripDotDone : ""
              } ${done > 0 && !isComplete ? classes.stripDotPartial : ""} ${
                day.day === today ? classes.stripDotToday : ""
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default DayStrip;
