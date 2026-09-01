import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ELanguage, ILanguagesState } from "../@types/language.type";
import { LANGUAGE_STATES } from "../utils/constants/language/index.constant";

interface ILanguageState {
  language: ELanguage;
  state: ILanguagesState;
  /** Колдонуучу тилди өзү тандаганбы */
  isLanguageManual: boolean;
}

interface ILanguageActions {
  setLanguage: (language: ELanguage, manual?: boolean) => void;
}

type TLanguageStore = ILanguageState & ILanguageActions;

export const useLanguageStore = create<TLanguageStore>()(
  persist(
    (set) => ({
      language: ELanguage.KG,
      state: LANGUAGE_STATES[ELanguage.KG],
      isLanguageManual: false,
      setLanguage: (language, manual = true) =>
        set({
          language,
          state: LANGUAGE_STATES[language],
          isLanguageManual: manual,
        }),
    }),
    {
      name: "language-store",
      // Котормолор коддон келет — localStorage'да эскирип калбашы үчүн сакталбайт
      partialize: (store) => ({
        language: store.language,
        isLanguageManual: store.isLanguageManual,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<ILanguageState>;
        const language = saved.language ?? current.language;
        return {
          ...current,
          ...saved,
          language,
          state: LANGUAGE_STATES[language] ?? LANGUAGE_STATES[ELanguage.KG],
        };
      },
    },
  ),
);
