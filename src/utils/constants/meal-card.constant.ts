import {
  leafOutline,
  moonOutline,
  pizza,
  restaurantOutline,
  sunnyOutline,
} from "ionicons/icons";
import { IMealAction } from "../../@types/meal.types";

export const FOOD_ACTIONS: IMealAction[] = [
  {
    key: "breakfast",
    title: "🍳 Эртең менен",
    icon: sunnyOutline,
    color: "warning",
  },
  {
    key: "lunch",
    title: "🍲 Түштө (обед)",
    icon: restaurantOutline,
    color: "primary",
  },
  { key: "dinner", title: "🥗 Кечки", icon: moonOutline, color: "dark" },
  { key: "snack", title: "🍰 Перекус", icon: pizza, color: "secondary" },
  {
    key: "fruit",
    title: "🍎 Жемиш",
    icon: leafOutline,
    color: "success",
  },
];
