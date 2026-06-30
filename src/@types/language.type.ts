export enum ELanguage {
  KG = "kg",
  RU = "ru",
  EN = "en",
}

export interface ILanguagesStateMealCard {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  fruit: string;
}

export interface ILanguagesStateFoodPage {
  title: string;
  food_list: string;
}

export interface ILanguagesStateHomePage {
  title: string;
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

export interface ILanguagesState {
  meal_card: ILanguagesStateMealCard;
  pages: {
    food: ILanguagesStateFoodPage;
    home: ILanguagesStateHomePage;
    profile: ILanguagesStateProfilePage;
    settings: ILanguagesStateSettingsPage;
  };
}
