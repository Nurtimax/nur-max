// src/types/meal.types.ts

import { ELanguage } from "./language.type";

export interface MealDayAction {
  name: Record<ELanguage, string>;
  complete: boolean;
  vegetables: Record<ELanguage, string>[];
  ingredients: Record<ELanguage, string>[];
  isFried: boolean;
  isDietary: boolean;
  dietaryNote: Record<ELanguage, string>;
}

export interface MealDay {
  day: number;
  breakfast: MealDayAction;
  lunch: MealDayAction;
  dinner: MealDayAction;
  fruit: MealDayAction;
  snack: MealDayAction;
}

export interface MealPlanData {
  version: string;
  list: MealDay[];
}

export type MealActionKey = keyof Omit<MealDay, "day">;
export interface IMealAction {
  key: MealActionKey;
  title: string;
  icon: string;
  color: string;
}
