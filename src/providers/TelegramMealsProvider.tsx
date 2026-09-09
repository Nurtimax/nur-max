import { useQuery } from "@tanstack/react-query";
import { FC, ReactNode, useEffect } from "react";
import { getMealRecords } from "../query/meals.query";
import { useBudgetStore } from "../store/budget.store";
import { toDateKey } from "../utils/helpers/budget.helper";
import { getWebApp, isTelegram } from "../utils/helpers/telegram.helper";

interface IProps {
  children: ReactNode;
}

/** Учурдагы айдын башталышы жана аягы: YYYY-MM-DD */
const monthRange = () => {
  const now = new Date();
  const from = toDateKey(new Date(now.getFullYear(), now.getMonth(), 1));
  const to = toDateKey(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  return { from, to };
};

/**
 * Telegram-боттон жазылган тамактын суммаларын алып,
 * бюджеттин чыгымдарына синхрондойт. setMealExpense ошол эле
 * meal:<date>:<key> id менен жазгандыктан, кайталанып эсептелбейт.
 */
const TelegramMealsProvider: FC<IProps> = ({ children }) => {
  const telegramId = isTelegram()
    ? getWebApp()?.initDataUnsafe?.user?.id
    : undefined;
  const month = toDateKey(new Date()).slice(0, 7);

  const { data } = useQuery({
    queryKey: ["telegram-meals", telegramId, month],
    queryFn: () => getMealRecords(telegramId!, monthRange().from, monthRange().to),
    enabled: !!telegramId,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data?.records.length) return;
    const { setMealExpense } = useBudgetStore.getState();
    data.records.forEach((record) => {
      setMealExpense({
        date: record.date,
        key: record.meal,
        amount: record.cost,
        note: "Telegram",
      });
    });
  }, [data]);

  return <>{children}</>;
};

export default TelegramMealsProvider;
