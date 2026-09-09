// src/types/meal.types.ts

import { ELanguage } from "./language.type";

export type LocalizedText = Record<ELanguage, string>;

export interface MealDayAction {
  name: LocalizedText;
  /** Бир порциянын болжолдуу баасы (сом) */
  price: number;
  complete: boolean;
}

export interface MealDay {
  day: number;
  breakfast: MealDayAction;
  lunch: MealDayAction;
  dinner: MealDayAction;
  fruit: MealDayAction;
}

export type MealActionKey = "breakfast" | "lunch" | "dinner" | "fruit";

/** Ар бир тамактын түрү боюнча тандоо тизмеси — алмаштыруу үчүн */
export type MealCatalog = Record<MealActionKey, MealDayAction[]>;

export interface MealPlanData {
  version: string;
  /** Планда каралган күндүк лимит (сом) */
  dailyLimit?: number;
  catalog?: MealCatalog;
  list: MealDay[];
}

export interface IMealAction {
  key: MealActionKey;
  title: string;
  icon: string;
  color: string;
  accent: string;
}

/** 7 күндүк блок — планды апталарга бөлгөндөн кийинки натыйжа */
export interface MealWeek {
  /** 0-баштап индекс */
  index: number;
  /** айдын күнү боюнча башталышы жана аягы (1..31) */
  from: number;
  to: number;
  days: MealDay[];
}

/** Telegram-боттон келген иштин тамактын суммасы (фронт←бек байланышы) */
export interface TelegramMealRecord {
  /** YYYY-MM-DD */
  date: string;
  meal: "breakfast" | "lunch" | "dinner";
  /** Сом менен */
  cost: number;
}
