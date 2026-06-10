import { MealPlanData } from "../@types/meal.types";
import api from "../utils/helpers/axios.helper";
import { API } from "./index.query";

export const getFoods = async () => {
  const data = await api.get<MealPlanData | null>(API.foods.getList);
  return data as unknown as MealPlanData;
};
