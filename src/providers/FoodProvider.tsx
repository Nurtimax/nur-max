import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { getFoods } from "../query/foods.query";
import { useFoodsStore } from "../store/foods.store";

interface FoodProviderProps {
  children: React.ReactNode;
}
const FoodProvider: FC<FoodProviderProps> = ({ children }) => {
  console.log("FoodProvider rendered");

  const now = new Date();
  const day = now.getDate();

  const toggleFoodsLoading = useFoodsStore((state) => state.toggleFoodsLoading);
  const setFoods = useFoodsStore((state) => state.setFoods);
  const isUpdated = useFoodsStore((state) => state.isUpdate);
  const updateIsUpdate = useFoodsStore((state) => state.updateIsUpdate);
  const version = useFoodsStore((state) => state.version);
  const serVersion = useFoodsStore((state) => state.setVersion);

  useQuery({
    queryKey: ["foods"],
    queryFn: async () => {
      toggleFoodsLoading();
      const response = await getFoods();
      if (response.version !== version) {
        serVersion(response.version);
      } else if (day !== 1) {
        if (isUpdated) {
          return null; // Skip fetching if data is already updated
        }
      }

      toggleFoodsLoading();

      setFoods(response.list);
      updateIsUpdate(true);
      return response;
    },
    initialData: null,
  });

  return <>{children}</>;
};

export default FoodProvider;
