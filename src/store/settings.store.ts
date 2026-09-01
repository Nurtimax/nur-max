import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IState {
  darkMode: boolean;
  isNotification: boolean;
  /** Колдонуучу теманы өзү тандаганбы — ооба болсо Telegram'дын темасы кийлигишпейт */
  isThemeManual: boolean;
}

interface IActions {
  setToggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
  setToggleNotification: () => void;
}

type ISettings = IState & IActions;

export const useSettings = create<ISettings>()(
  persist(
    (set) => ({
      darkMode: true,
      isNotification: false,
      isThemeManual: false,
      setToggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode, isThemeManual: true })),
      setDarkMode: (darkMode) => set({ darkMode }),
      setToggleNotification: () =>
        set((state) => ({ isNotification: !state.isNotification })),
    }),
    { name: "settings-store" },
  ),
);
