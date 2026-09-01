export enum ELanguage {
  KG = "kg",
  RU = "ru",
  EN = "en",
}

export interface ILanguagesStateMealCard {
  breakfast: string;
  lunch: string;
  dinner: string;
  fruit: string;
  mark_done: string;
  mark_undone: string;
  swap: string;
}

export interface ILanguagesStateFoodPage {
  title: string;
  food_list: string;
  empty: string;
}

export interface ILanguagesStateHomePage {
  title: string;
  today: string;
  this_week: string;
  meals_done: string;
  all_done: string;
  empty: string;
  open_week: string;
  greeting_morning: string;
  greeting_day: string;
  greeting_evening: string;
  greeting_night: string;
}

export interface ILanguagesStateProfilePage {
  title: string;
  name: string;
  name_placeholder: string;
  email: string;
  email_placeholder: string;
  photo_url: string;
  photo_url_placeholder: string;
  save: string;
  save_success: string;
  save_error: string;
}

export interface ILanguagesStateSettingsPage {
  title: string;
  dark_mode: string;
  language: string;
  language_label: string;
  language_placeholder: string;
  language_cancel: string;
  notifications: string;
  platform: string;
  version: string;
}

export interface ILanguagesStateBudgetPage {
  title: string;
  subtitle: string;
  today: string;
  spent: string;
  left: string;
  over_by: string;
  limit: string;
  daily_limit: string;
  daily_limit_hint: string;
  add: string;
  amount_placeholder: string;
  category: string;
  note: string;
  note_placeholder: string;
  save: string;
  delete: string;
  empty: string;
  week_spent: string;
  month_spent: string;
  plan: string;
  avg_day: string;
  of_limit: string;
  other: string;
  day_expenses: string;
}

export interface ILanguagesStateCommon {
  /** Валютанын кыскача аталышы */
  currency: string;
  /** 0 — жекшемби, Date.getDay() тартиби боюнча */
  weekdays: string[];
  weekdays_short: string[];
  months: string[];
}

export interface ILanguagesState {
  common: ILanguagesStateCommon;
  meal_card: ILanguagesStateMealCard;
  pages: {
    budget: ILanguagesStateBudgetPage;
    food: ILanguagesStateFoodPage;
    home: ILanguagesStateHomePage;
    profile: ILanguagesStateProfilePage;
    settings: ILanguagesStateSettingsPage;
  };
}
