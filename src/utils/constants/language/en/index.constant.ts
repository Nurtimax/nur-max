import { ILanguagesState } from "../../../../@types/language.type";

export const LANGUAGE_STATE_EN: ILanguagesState = {
  meal_card: {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    fruit: "Fruit",
  },
  pages: {
    food: {
      title: "Foods",
      food_list: "Food list",
    },
    home: {
      title: "Home",
    },
    profile: {
      title: "Profile",
      name: "Name",
      name_placeholder: "Enter your name",
      email: "Email",
      email_placeholder: "Enter your email",
      photo_url: "Photo URL",
      photo_url_placeholder: "Enter photo URL",
      save: "Save",
      save_success: "Profile saved successfully",
      save_error: "Profile not saved",
    },
    settings: {
      title: "Settings",
      dark_mode: "Dark mode",
      language: "Select language",
      language_label: "Select language",
      language_placeholder: "Select language",
      language_cancel: "Cancel",
      notifications: "Notifications",
      platform: "Platform",
      version: "Version",
    },
  },
};
