import { MealDayAction } from "../../@types/meal.types";

/**
 * Тизмеден кокустан бир тамак тандайт.
 * Учурдагы тамак кайра тандалбашы үчүн тизмеден чыгарылат.
 */
export const pickRandomMeal = (
  pool: MealDayAction[] = [],
  currentName?: string,
): MealDayAction | null => {
  if (!pool.length) return null;

  const options = pool.filter((item) => item.name.kg !== currentName);
  const list = options.length ? options : pool;

  return list[Math.floor(Math.random() * list.length)];
};
