import { walletOutline } from "ionicons/icons";
import { ExpenseCategory } from "../../@types/budget.types";
import { ILanguagesState } from "../../@types/language.type";
import { MEAL_META, MEAL_ORDER } from "./meal-card.constant";

export interface IExpenseCategory {
  key: ExpenseCategory;
  title: string;
  icon: string;
  accent: string;
}

/** Тез суммалар — бир басууда кошуу үчүн */
export const QUICK_AMOUNTS = [50, 100, 200, 500];

export const getExpenseCategories = (
  state: ILanguagesState,
): IExpenseCategory[] => [
  ...MEAL_ORDER.map((key) => ({
    key: key as ExpenseCategory,
    title: state.meal_card[key],
    icon: MEAL_META[key].icon,
    accent: MEAL_META[key].accent,
  })),
  {
    key: "other" as ExpenseCategory,
    title: state.pages.budget.other,
    icon: walletOutline,
    accent: "var(--nm-text-muted)",
  },
];

export const getCategoryMeta = (
  category: ExpenseCategory,
  state: ILanguagesState,
): IExpenseCategory =>
  getExpenseCategories(state).find((item) => item.key === category) ?? {
    key: "other",
    title: state.pages.budget.other,
    icon: walletOutline,
    accent: "var(--nm-text-muted)",
  };
