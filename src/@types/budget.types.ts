import { MealActionKey } from "./meal.types";

/** Чыгымдын категориясы — тамактын түрү же "башка" */
export type ExpenseCategory = MealActionKey | "other";

export interface Expense {
  id: string;
  /** YYYY-MM-DD форматындагы күн */
  date: string;
  /** Сумма — сом менен */
  amount: number;
  category: ExpenseCategory;
  note?: string;
  createdAt: number;
}

/** Бир күндүн бюджет абалы */
export interface DayBudget {
  /** Айдын күнү (1..31) */
  day: number;
  date: string;
  spent: number;
  limit: number;
  left: number;
  percent: number;
  isOver: boolean;
}

/** 7 күндүк бюджет блогу */
export interface BudgetWeek {
  index: number;
  from: number;
  to: number;
  days: DayBudget[];
  spent: number;
  limit: number;
  percent: number;
}
