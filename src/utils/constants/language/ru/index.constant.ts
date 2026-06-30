import { ILanguagesState } from "../../../../@types/language.type";

export const LANGUAGE_STATE_RU: ILanguagesState = {
  meal_card: {
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    snack: "Перекус",
    fruit: "Фрукты",
  },
  pages: {
    food: {
      title: "Продукты",
      food_list: "Список продуктов",
    },
    home: {
      title: "Главная",
    },
    profile: {
      title: "Профиль",
      name: "Имя",
      name_placeholder: "Введите ваше имя",
      email: "Электронная почта",
      email_placeholder: "Введите вашу почту",
      photo_url: "URL фото",
      photo_url_placeholder: "Введите URL фото",
      save: "Сохранить",
      save_success: "Профиль успешно сохранен",
      save_error: "Профиль не сохранен",
    },
    settings: {
      title: "Настройки",
      dark_mode: "Темный режим",
      language: "Выберите язык",
      language_label: "Выберите язык",
      language_placeholder: "Выберите язык",
      language_cancel: "Отмена",
      notifications: "Уведомления",
      platform: "Платформа",
      version: "Версия",
    },
  },
};
