// src/types/meal.types.ts

export interface MealDayAction {
  name: string;
  complete: boolean;
}
export interface MealDay {
  day: number;
  breakfast: MealDayAction;
  lunch: MealDayAction;
  dinner: MealDayAction;
  fruit: MealDayAction;
}

export interface MealPlanData {
  list: MealDay[];
}

export interface IMealAction {
  key: keyof Omit<MealDay, "day">;
  title: string;
  icon: string;
  color: string;
}
