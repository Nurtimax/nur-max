import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IState {
  darkMode: boolean;
  isNotification: boolean;
}

interface IActions {
  setToggleDarkMode: () => void;
  setToggleNotification: () => void;
}

type ISettings = IState & IActions;

export const useSettings = create<ISettings>()(
  persist(
    (set) => ({
      darkMode: true,
      isNotification: false,
      setToggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setToggleNotification: () =>
        set((state) => ({ isNotification: !state.isNotification })),
    }),
    { name: "settings-store" },
  ),
);
