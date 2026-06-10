// src/types/meal.types.ts
export interface MealDay {
  day: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  fruit: string;
}

export interface MealPlanData {
  list: MealDay[];
}
