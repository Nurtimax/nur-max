import {
  leafOutline,
  moonOutline,
  restaurantOutline,
  sunnyOutline,
} from "ionicons/icons";
import { IMealAction, MealActionKey } from "../../@types/meal.types";
import { ILanguagesStateMealCard } from "../../@types/language.type";

/** Ар бир тамактын иконкасы жана түсү (CSS токендери variables.css ичинде) */
export const MEAL_META: Record<
  MealActionKey,
  { icon: string; color: string; accent: string }
> = {
  breakfast: {
    icon: sunnyOutline,
    color: "warning",
    accent: "var(--nm-meal-breakfast)",
  },
  lunch: {
    icon: restaurantOutline,
    color: "primary",
    accent: "var(--nm-meal-lunch)",
  },
  dinner: {
    icon: moonOutline,
    color: "tertiary",
    accent: "var(--nm-meal-dinner)",
  },
  fruit: { icon: leafOutline, color: "success", accent: "var(--nm-meal-fruit)" },
};

/** Тамактардын күн ичиндеги тартиби */
export const MEAL_ORDER: MealActionKey[] = [
  "breakfast",
  "lunch",
  "dinner",
  "fruit",
];

export const getMealActions = (state: ILanguagesStateMealCard): IMealAction[] =>
  MEAL_ORDER.map((key) => ({
    key,
    title: state[key],
    ...MEAL_META[key],
  }));
