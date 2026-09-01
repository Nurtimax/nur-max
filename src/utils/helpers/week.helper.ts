import { MealActionKey, MealDay, MealWeek } from "../../@types/meal.types";

/** Бир аптадагы күндөрдүн саны */
export const WEEK_SIZE = 7;

/** Бир күндөгү тамактардын тартиби */
export const MEAL_KEYS: MealActionKey[] = [
  "breakfast",
  "lunch",
  "dinner",
  "fruit",
];

/**
 * Планды 7 күндүк апталарга бөлөт.
 * 31 күн -> 5 апта: [1-7], [8-14], [15-21], [22-28], [29-31].
 * Акыркы апта толук эмес болушу мүмкүн — бул нормалдуу.
 */
export const groupIntoWeeks = (list: MealDay[]): MealWeek[] => {
  const sorted = [...list].sort((a, b) => a.day - b.day);
  const weeks: MealWeek[] = [];

  for (let i = 0; i < sorted.length; i += WEEK_SIZE) {
    const days = sorted.slice(i, i + WEEK_SIZE);
    weeks.push({
      index: weeks.length,
      from: days[0]?.day ?? i + 1,
      to: days[days.length - 1]?.day ?? i + WEEK_SIZE,
      days,
    });
  }

  return weeks;
};

/** Айдын күнү (1..31) кайсы аптага тиешелүү экенин кайтарат */
export const getWeekIndexByDay = (day: number): number =>
  Math.max(0, Math.floor((day - 1) / WEEK_SIZE));

/** Бүгүнкү күн — айдын күнү (1..31) */
export const getTodayNumber = (date: Date = new Date()): number =>
  date.getDate();

/** Планга кирген күндүн реалдуу датасын кайтарат (учурдагы ай боюнча) */
export const getDateForDay = (day: number, base: Date = new Date()): Date =>
  new Date(base.getFullYear(), base.getMonth(), day);

/** getDay() индекси: 0 — жекшемби */
export const getWeekdayIndex = (day: number, base: Date = new Date()): number =>
  getDateForDay(day, base).getDay();

/** Күн учурдагы айда бар-жогун текшерет (мис. 31-февраль жок) */
export const isDayInCurrentMonth = (
  day: number,
  base: Date = new Date(),
): boolean => getDateForDay(day, base).getMonth() === base.getMonth();

/** Бир күндө канча тамак белгиленгенин эсептейт */
export const countCompleted = (meal?: MealDay): number => {
  if (!meal) return 0;
  return MEAL_KEYS.reduce(
    (total, key) => total + (meal[key]?.complete ? 1 : 0),
    0,
  );
};

/** Бир күндөгү жалпы тамактардын саны (маалымат жок болсо эсептебейт) */
export const countTotal = (meal?: MealDay): number => {
  if (!meal) return 0;
  return MEAL_KEYS.reduce((total, key) => total + (meal[key] ? 1 : 0), 0);
};

/** Күндүн планы боюнча жалпы баасы (сом) */
export const getDayPlanPrice = (meal?: MealDay): number => {
  if (!meal) return 0;
  return MEAL_KEYS.reduce((total, key) => total + (meal[key]?.price ?? 0), 0);
};

/** Аптанын планы боюнча жалпы баасы */
export const getWeekPlanPrice = (days: MealDay[] = []): number =>
  days.reduce((total, day) => total + getDayPlanPrice(day), 0);

/** Аптанын жалпы прогресси */
export const getWeekProgress = (week?: MealWeek) => {
  const days = week?.days ?? [];
  const done = days.reduce((total, day) => total + countCompleted(day), 0);
  const total = days.reduce((sum, day) => sum + countTotal(day), 0);
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
};
