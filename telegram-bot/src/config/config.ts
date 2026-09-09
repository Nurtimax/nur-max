// Бардык тексттер жана жыштык/убакыт параметрлери ушул жерде.
export const CONFIG = {
  timezone: 'Asia/Bishkek',

  startMessage: 'Салам! Эскертүүлөр күйдү.',

  // Түшкүч (wake-up) сериясы
  wake: {
    cron: '0 6 * * *', // 06:00 Бишкек
    intervalMin: 30,
    maxSent: 4,
    message: 'Тур! Кун жакшы! 🌅',
    button: 'Турдум ✅',
  },

  // Тамактар: ask -> (медицина, жөн гана таңгы) -> sport -> done
  meals: {
    breakfast: {
      cron: '30 7 * * *', // 07:30
      label: 'Завтрак',
      askMessage: 'Завтрак жедиңби? 🍳',
      ateButton: 'Жедим ✅',
      withMedicine: true,
    },
    lunch: {
      cron: '0 13 * * *', // 13:00
      label: 'Обед',
      askMessage: 'Обед вакты! Жей тур 🍽',
      ateButton: 'Жедим ✅',
      withMedicine: false,
    },
    dinner: {
      cron: '0 19 * * *', // 19:00
      label: 'Ужин',
      askMessage: 'Ужин вакты! Жей тур 🍽',
      ateButton: 'Жедим ✅',
      withMedicine: false,
    },
  },

  medicine: {
    message: 'Дары ич! 💊',
    button: 'Ичтим ✅',
    maxSent: 3,
    intervalMin: 30,
  },

  sport: {
    message: 'Спорт кыл! 🏃',
    button: 'Спорт кылдым ✅',
  },

  mealAsk: {
    maxSent: 3,
    intervalMin: 30,
  },

  // Тамактын суммасы: "Жедим" басылгандан кийин суралат
  cost: {
    message: 'Канча сомго жедиң? 💸',
    customButton: 'Башка сумма ✏️',
    customPrompt: 'Сумманы жазыңыз (мисалы: 180)',
    amounts: [100, 150, 200, 250, 300],
    savedToast: 'Сакталды ✅',
    invalidAmount: 'Сан жазыңыз, мисалы: 180',
    todayEmpty: 'Бүгүн тамак жазыле элек. 🍽',
    telegramNote: 'Telegram',
  },
} as const;

export type MealKey = keyof typeof CONFIG.meals;
