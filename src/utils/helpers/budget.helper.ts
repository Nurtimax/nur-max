import {
  BudgetWeek,
  DayBudget,
  Expense,
  ExpenseCategory,
} from "../../@types/budget.types";
import { WEEK_SIZE } from "./week.helper";

/** Күндүн ачкычы: YYYY-MM-DD */
export const toDateKey = (date: Date): string => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

/** Учурдагы айдын берилген күнүнүн ачкычы */
export const dateKeyForDay = (day: number, base: Date = new Date()): string =>
  toDateKey(new Date(base.getFullYear(), base.getMonth(), day));

export const todayKey = (base: Date = new Date()): string => toDateKey(base);

/** Учурдагы айдагы күндөрдүн саны */
export const daysInMonth = (base: Date = new Date()): number =>
  new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

export const getExpensesByDate = (
  expenses: Expense[],
  date: string,
): Expense[] =>
  expenses
    .filter((expense) => expense.date === date)
    .sort((a, b) => b.createdAt - a.createdAt);

export const sumExpenses = (expenses: Expense[], date?: string): number =>
  expenses
    .filter((expense) => !date || expense.date === date)
    .reduce((total, expense) => total + expense.amount, 0);

/** Бир күндүн бюджет абалы */
export const getDayBudget = (
  day: number,
  expenses: Expense[],
  limit: number,
  base: Date = new Date(),
): DayBudget => {
  const date = dateKeyForDay(day, base);
  const spent = sumExpenses(expenses, date);
  return {
    day,
    date,
    spent,
    limit,
    left: limit - spent,
    percent: limit > 0 ? Math.round((spent / limit) * 100) : 0,
    isOver: limit > 0 && spent > limit,
  };
};

/** Учурдагы айды 7 күндүк блокторго бөлүп, ар бирине чыгымды эсептейт */
export const getBudgetWeeks = (
  expenses: Expense[],
  limit: number,
  base: Date = new Date(),
): BudgetWeek[] => {
  const total = daysInMonth(base);
  const weeks: BudgetWeek[] = [];

  for (let start = 1; start <= total; start += WEEK_SIZE) {
    const days: DayBudget[] = [];
    for (let day = start; day < start + WEEK_SIZE && day <= total; day += 1) {
      days.push(getDayBudget(day, expenses, limit, base));
    }

    const spent = days.reduce((sum, day) => sum + day.spent, 0);
    const weekLimit = limit * days.length;

    weeks.push({
      index: weeks.length,
      from: days[0].day,
      to: days[days.length - 1].day,
      days,
      spent,
      limit: weekLimit,
      percent: weekLimit > 0 ? Math.round((spent / weekLimit) * 100) : 0,
    });
  }

  return weeks;
};

/** Учурдагы айдын жалпы чыгымы */
export const getMonthSpent = (
  expenses: Expense[],
  base: Date = new Date(),
): number => {
  const prefix = toDateKey(base).slice(0, 7);
  return expenses
    .filter((expense) => expense.date.startsWith(prefix))
    .reduce((total, expense) => total + expense.amount, 0);
};

/** Категориялар боюнча бөлүштүрүү */
export const groupByCategory = (
  expenses: Expense[],
): Record<ExpenseCategory, number> => {
  const result = {} as Record<ExpenseCategory, number>;
  expenses.forEach((expense) => {
    result[expense.category] = (result[expense.category] ?? 0) + expense.amount;
  });
  return result;
};

/** 1200 -> "1 200" */
export const formatAmount = (amount: number): string => {
  const rounded = Math.round(amount * 100) / 100;
  return rounded.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
};

export const formatMoney = (amount: number, currency: string): string =>
  `${formatAmount(amount)} ${currency}`;
