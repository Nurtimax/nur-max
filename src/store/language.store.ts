import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ELanguage, ILanguagesState } from "../@types/language.type";
import { LANGUAGE_STATES } from "../utils/constants/language/index.constant";

interface ILanguageState {
  language: ELanguage;
  state: ILanguagesState;
}

interface ILanguageActions {
  setLanguage: (language: ELanguage) => void;
}

type TLanguageStore = ILanguageState & ILanguageActions;

export const useLanguageStore = create<TLanguageStore>()(
  persist(
    (set, get) => {
      const language = get()?.language || ELanguage.KG;
      return {
        language: ELanguage.KG,
        state: LANGUAGE_STATES[language],
        setLanguage: (language) =>
          set({ language, state: LANGUAGE_STATES[language] }),
      };
    },
    { name: "language-store" },
  ),
);
