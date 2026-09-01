import { ELanguage, ILanguagesState } from "../../../@types/language.type";
import { getDateForDay } from "../../helpers/week.helper";
import { LANGUAGE_STATE_EN } from "./en/index.constant";
import { LANGUAGE_STATE_KG } from "./kg/index.constant";
import { LANGUAGE_STATE_RU } from "./ru/index.constant";

export const LANGUAGE_STATES: Record<ELanguage, ILanguagesState> = {
  [ELanguage.KG]: LANGUAGE_STATE_KG,
  [ELanguage.RU]: LANGUAGE_STATE_RU,
  [ELanguage.EN]: LANGUAGE_STATE_EN,
};

export const getDayLabel = (day: number, lang: ELanguage): string => {
  switch (lang) {
    case ELanguage.RU:
      return `${day}-й день`;
    case ELanguage.KG:
      return `${day}-күнү`;
    case ELanguage.EN:
    default:
      return `Day ${day}`;
  }
};

/** "2-апта" / "2-я неделя" / "Week 2" */
export const getWeekLabel = (weekIndex: number, lang: ELanguage): string => {
  const number = weekIndex + 1;
  switch (lang) {
    case ELanguage.RU:
      return `${number}-я неделя`;
    case ELanguage.KG:
      return `${number}-апта`;
    case ELanguage.EN:
    default:
      return `Week ${number}`;
  }
};

/** Аптанын кыска аталышы — өтмөктөр үчүн: "2-апта" / "2 нед." / "W2" */
export const getWeekShortLabel = (
  weekIndex: number,
  lang: ELanguage,
): string => {
  const number = weekIndex + 1;
  switch (lang) {
    case ELanguage.RU:
      return `${number} нед.`;
    case ELanguage.KG:
      return `${number}-апта`;
    case ELanguage.EN:
    default:
      return `W${number}`;
  }
};

export const getWeekdayLabel = (
  day: number,
  lang: ELanguage,
  short = false,
): string => {
  const state = LANGUAGE_STATES[lang];
  const index = getDateForDay(day).getDay();
  return short
    ? state.common.weekdays_short[index]
    : state.common.weekdays[index];
};

/** "1-сентябрь" / "1 сентября" / "September 1" */
export const getDateLabel = (day: number, lang: ELanguage): string => {
  const month = LANGUAGE_STATES[lang].common.months[getDateForDay(day).getMonth()];
  switch (lang) {
    case ELanguage.RU:
      return `${day} ${month}`;
    case ELanguage.KG:
      return `${day}-${month}`;
    case ELanguage.EN:
    default:
      return `${month} ${day}`;
  }
};

export const getGreeting = (lang: ELanguage, date: Date = new Date()) => {
  const t = LANGUAGE_STATES[lang].pages.home;
  const hours = date.getHours();

  if (hours < 6) return t.greeting_night;
  if (hours < 12) return t.greeting_morning;
  if (hours < 18) return t.greeting_day;
  return t.greeting_evening;
};
