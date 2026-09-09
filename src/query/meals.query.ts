import { TelegramMealRecord } from "../@types/meal.types";
import api from "../utils/helpers/axios.helper";
import { API } from "./index.query";

interface IMealsResponse {
  records: TelegramMealRecord[];
  total: number;
}

/**
 * Боттун REST API'sinden тамактын суммаларын алат.
 * VITE_API_URL орнотулса (мис. "https://bot.example.com/api") ошол колдонулат,
 * жок болсо — демейки "api/meals" (локалда vite proxy аркылуу ботко барат).
 */
export const getMealRecords = async (
  telegramId: number,
  from: string,
  to: string,
) => {
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
  const path = base
    ? `${base}/${API.meals.getRecords}/${telegramId}?from=${from}&to=${to}`
    : `${API.meals.getRecords}/${telegramId}?from=${from}&to=${to}`;
  const data = await api.get<IMealsResponse>(path);
  return data as unknown as IMealsResponse;
};
