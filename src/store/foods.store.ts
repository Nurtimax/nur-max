import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MealActionKey,
  MealCatalog,
  MealDay,
  MealDayAction,
} from "../@types/meal.types";

interface Food {
  version: string | null;
  foods: MealDay[];
  /** Алмаштыруу үчүн тамактардын тизмеси */
  catalog: MealCatalog | null;
  /** План акыркы жолу кайсы айга жүктөлдү — "2026-09" */
  syncedMonth: string | null;
  isUpdate: boolean;
  isLoading: boolean;
}

interface FoodsStore extends Food {
  setFoods: (foods: MealDay[]) => void;
  setCatalog: (catalog: MealCatalog | null) => void;
  setSyncedMonth: (month: string) => void;
  setVersion: (version: string) => void;
  toggleFoodsLoading: () => void;
  toggleFoodsComplete: (day: number, key: MealActionKey) => void;
  replaceMeal: (day: number, key: MealActionKey, meal: MealDayAction) => void;
  setMealPrice: (day: number, key: MealActionKey, price: number) => void;
  updateIsUpdate: (isUpdate: boolean) => void;
}

export const useFoodsStore = create<FoodsStore>()(
  persist(
    (set) => ({
      version: null,
      foods: [],
      catalog: null,
      syncedMonth: null,
      isUpdate: false,
      isLoading: false,
      setFoods: (foods) => set({ foods }),
      setCatalog: (catalog) => set({ catalog }),
      setSyncedMonth: (syncedMonth) => set({ syncedMonth }),
      setVersion: (version) => set({ version }),
      toggleFoodsLoading: () =>
        set((state) => ({ isLoading: !state.isLoading })),
      toggleFoodsComplete: (day, key) =>
        set((state) => {
          const updatedFoods = state.foods.map((meal) => {
            if (meal.day === day) {
              return {
                ...meal,
                [key]: {
                  ...meal[key],
                  complete: !meal[key].complete,
                },
              };
            }
            return meal;
          });
          return { foods: updatedFoods, isUpdate: !state.isUpdate };
        }),
      // Тамак жок болуп калса — башкасына алмаштыруу
      replaceMeal: (day, key, replacement) =>
        set((state) => ({
          foods: state.foods.map((meal) =>
            meal.day === day
              ? {
                  ...meal,
                  // белгиленген абалы сакталат
                  [key]: { ...replacement, complete: meal[key]?.complete ?? false },
                }
              : meal,
          ),
        })),
      // Колдонуучу тамактын суммасын өзү жазат
      setMealPrice: (day, key, price) =>
        set((state) => ({
          foods: state.foods.map((meal) =>
            meal.day === day
              ? { ...meal, [key]: { ...meal[key], price: Math.max(0, price) } }
              : meal,
          ),
        })),
      updateIsUpdate: (isUpdate) => set({ isUpdate }),
    }),
    {
      name: "foods-storage",
    },
  ),
);
