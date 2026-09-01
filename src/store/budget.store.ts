import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Expense, ExpenseCategory } from "../@types/budget.types";
import { MealActionKey } from "../@types/meal.types";
import { todayKey } from "../utils/helpers/budget.helper";

/** Күнүмдүк лимит — демейки 600 сом */
export const DEFAULT_DAILY_LIMIT = 600;

interface IState {
  dailyLimit: number;
  expenses: Expense[];
}

interface IActions {
  setDailyLimit: (limit: number) => void;
  addExpense: (payload: {
    amount: number;
    category: ExpenseCategory;
    note?: string;
    date?: string;
  }) => void;
  removeExpense: (id: string) => void;
  /** Тамак "жедим" деп белгиленгенде — анын суммасын чыгымга жазат */
  setMealExpense: (payload: {
    date: string;
    key: MealActionKey;
    amount: number;
    note?: string;
  }) => void;
  removeMealExpense: (date: string, key: MealActionKey) => void;
  clearDay: (date: string) => void;
}

type TBudgetStore = IState & IActions;

/** Тамактан келген чыгымдын туруктуу id'си — кайталанып жазылбашы үчүн */
export const mealExpenseId = (date: string, key: MealActionKey) =>
  `meal:${date}:${key}`;

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useBudgetStore = create<TBudgetStore>()(
  persist(
    (set) => ({
      dailyLimit: DEFAULT_DAILY_LIMIT,
      expenses: [],
      setDailyLimit: (limit) =>
        set({ dailyLimit: Number.isFinite(limit) && limit > 0 ? limit : 0 }),
      addExpense: ({ amount, category, note, date }) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            {
              id: createId(),
              date: date ?? todayKey(),
              amount,
              category,
              note: note?.trim() || undefined,
              createdAt: Date.now(),
            },
          ],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      setMealExpense: ({ date, key, amount, note }) =>
        set((state) => {
          const id = mealExpenseId(date, key);
          const expense: Expense = {
            id,
            date,
            amount,
            category: key,
            note,
            createdAt: Date.now(),
          };
          const exists = state.expenses.some((item) => item.id === id);
          return {
            expenses: exists
              ? state.expenses.map((item) => (item.id === id ? expense : item))
              : [...state.expenses, expense],
          };
        }),
      removeMealExpense: (date, key) =>
        set((state) => ({
          expenses: state.expenses.filter(
            (expense) => expense.id !== mealExpenseId(date, key),
          ),
        })),
      clearDay: (date) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.date !== date),
        })),
    }),
    { name: "budget-storage" },
  ),
);
