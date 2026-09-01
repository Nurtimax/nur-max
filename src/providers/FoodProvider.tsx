import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { getFoods } from "../query/foods.query";
import { useFoodsStore } from "../store/foods.store";

interface FoodProviderProps {
  children: React.ReactNode;
}

/** Учурдагы айдын ачкычы: "2026-09" */
const getMonthKey = (date = new Date()) =>
  `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;

const FoodProvider: FC<FoodProviderProps> = ({ children }) => {
  const monthKey = getMonthKey();

  const setFoods = useFoodsStore((state) => state.setFoods);
  const setCatalog = useFoodsStore((state) => state.setCatalog);
  const setVersion = useFoodsStore((state) => state.setVersion);
  const setSyncedMonth = useFoodsStore((state) => state.setSyncedMonth);
  const updateIsUpdate = useFoodsStore((state) => state.updateIsUpdate);

  useQuery({
    queryKey: ["foods", monthKey],
    queryFn: async () => {
      const response = await getFoods();

      const { version, syncedMonth, catalog } = useFoodsStore.getState();
      const isNewVersion = response.version !== version;
      // План ай сайын бир жолу гана жаңыртылат — алмаштыруулар менен
      // белгилер айдын ичинде сакталып турушу үчүн
      const isNewMonth = syncedMonth !== monthKey;

      if (isNewVersion || isNewMonth) {
        setFoods(response.list);
        setCatalog(response.catalog ?? null);
        setVersion(response.version);
        setSyncedMonth(monthKey);
        updateIsUpdate(true);
      } else if (!catalog && response.catalog) {
        // Каталог гана жетишпей турса — планды тийбей толуктайбыз
        setCatalog(response.catalog);
      }

      return response;
    },
    initialData: null,
  });

  return <>{children}</>;
};

export default FoodProvider;
