import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MealActionKey, MealDay } from "../@types/meal.types";

interface Food {
  foods: MealDay[];
  isUpdate: boolean;
  isLoading: boolean;
}

interface FoodsStore extends Food {
  setFoods: (foods: MealDay[]) => void;
  toggleFoodsLoading: () => void;
  toggleFoodsComplete: (day: number, key: MealActionKey) => void;
  updateIsUpdate: (isUpdate: boolean) => void;
}

export const useFoodsStore = create<FoodsStore>()(
  persist(
    (set) => ({
      foods: [],
      isUpdate: false,
      isLoading: false,
      setFoods: (foods) => set({ foods }),
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
      updateIsUpdate: (isUpdate) => set({ isUpdate }),
    }),
    {
      name: "foods-storage",
    },
  ),
);
