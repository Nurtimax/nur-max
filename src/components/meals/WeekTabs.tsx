import { FC } from "react";
import { ELanguage } from "../../@types/language.type";
import { getWeekShortLabel } from "../../utils/constants/language/index.constant";
import { hapticSelection } from "../../utils/helpers/telegram.helper";
import classes from "./index.module.css";

export interface IWeekTab {
  index: number;
  from: number;
  to: number;
}

interface IProps {
  weeks: IWeekTab[];
  activeIndex: number;
  onChange: (index: number) => void;
  language: ELanguage;
  todayWeekIndex?: number;
  /** Аптанын толтуруу пайызы (0..100) */
  percentOf?: (weekIndex: number) => number;
}

const WeekTabs: FC<IProps> = ({
  weeks,
  activeIndex,
  onChange,
  language,
  todayWeekIndex,
  percentOf,
}) => (
  <div className={classes.weekTabs}>
    {weeks.map((week) => {
      const percent = percentOf?.(week.index) ?? 0;
      const isActive = week.index === activeIndex;

      return (
        <button
          key={week.index}
          type="button"
          className={`${classes.weekTab} ${isActive ? classes.weekTabActive : ""}`}
          onClick={() => {
            hapticSelection();
            onChange(week.index);
          }}
        >
          <span className={classes.weekTabTitle}>
            {getWeekShortLabel(week.index, language)}
            {week.index === todayWeekIndex && (
              <span className={classes.weekTabDot} />
            )}
          </span>
          <span className={classes.weekTabRange}>
            {week.from}–{week.to}
          </span>
          <span className={classes.weekTabBar}>
            <span
              className={classes.weekTabBarFill}
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </span>
        </button>
      );
    })}
  </div>
);

export default WeekTabs;
