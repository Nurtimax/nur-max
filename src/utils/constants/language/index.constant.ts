import { ELanguage, ILanguagesState } from "../../../@types/language.type";
import { LANGUAGE_STATE_EN } from "./en/index.constant";
import { LANGUAGE_STATE_KG } from "./kg/index.constant";
import { LANGUAGE_STATE_RU } from "./ru/index.constant";

export const LANGUAGE_STATES: Record<ELanguage, ILanguagesState> = {
  [ELanguage.KG]: LANGUAGE_STATE_KG,
  [ELanguage.RU]: LANGUAGE_STATE_RU,
  [ELanguage.EN]: LANGUAGE_STATE_EN,
};

export const getDayLabel = (day: number, lang: ELanguage): string => {
  switch (lang) {
    case ELanguage.RU:
      return `${day}-й день`;
    case ELanguage.KG:
      return `${day}-күнү`;
    case ELanguage.EN:
      return `Day ${day}`;
    default:
      return `Day ${day}`;
  }
};
