// src/types/meal.types.ts

export interface MealDayAction {
  name: string;
  complete: boolean;
  vegetables: string[];
  ingredients: string[];
  isFried: boolean;
  isDietary: boolean;
  dietaryNote: string;
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
