import { create } from "zustand";
import { ExpenseCategory } from "../@types/budget.types";

interface IState {
  isOpen: boolean;
  category: ExpenseCategory;
  /** Айдын күнү (1..31) — чыгым кайсы күнгө жазылат */
  day: number | null;
  /** Алдын ала толтурулган сумма (тамактын баасы) */
  amount: number | null;
}

interface IActions {
  open: (payload?: {
    category?: ExpenseCategory;
    day?: number;
    amount?: number;
  }) => void;
  close: () => void;
}

/** Чыгым кошуу терезесин каалаган жерден ачуу үчүн */
export const useExpenseSheet = create<IState & IActions>((set) => ({
  isOpen: false,
  category: "other",
  day: null,
  amount: null,
  open: (payload) =>
    set({
      isOpen: true,
      category: payload?.category ?? "other",
      day: payload?.day ?? null,
      amount: payload?.amount ?? null,
    }),
  close: () => set({ isOpen: false }),
}));
