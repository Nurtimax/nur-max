import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CONFIG, MealKey } from './config';
import { StateService } from './state.service';
import { BotUpdate } from './bot.update';

@Injectable()
export class BotScheduler {
  private readonly logger = new Logger(BotScheduler.name);

  constructor(
    private readonly state: StateService,
    private readonly bot: BotUpdate,
  ) {}

  // ---- Түшкүч сериясы: 06:00 ----
  @Cron(CONFIG.wake.cron, { timeZone: CONFIG.timezone })
  async startWake() {
    const now = Date.now();
    for (const id of this.state.allRegisteredIds()) {
      const w = this.state.get(id).wake;
      w.done = false;
      w.sent = 1;
      w.lastSentAt = now;
      await this.bot.send(id, CONFIG.wake.message, CONFIG.wake.button, 'wake');
    }
    this.state.save();
  }

  // ---- Тамактарды баштоо ----
  @Cron(CONFIG.meals.breakfast.cron, { timeZone: CONFIG.timezone })
  startBreakfast() {
    return this.startMeal('breakfast');
  }

  @Cron(CONFIG.meals.lunch.cron, { timeZone: CONFIG.timezone })
  startLunch() {
    return this.startMeal('lunch');
  }

  @Cron(CONFIG.meals.dinner.cron, { timeZone: CONFIG.timezone })
  startDinner() {
    return this.startMeal('dinner');
  }

  private async startMeal(meal: MealKey) {
    const cfg = CONFIG.meals[meal];
    const now = Date.now();
    for (const id of this.state.allRegisteredIds()) {
      // Мурунку күнү бүтпей калган серияны баштапкы абалга келтирүү
      const m = this.state.get(id)[meal];
      m.step = 'ask';
      m.sent = 1;
      m.lastSentAt = now;
      await this.bot.send(id, cfg.askMessage, cfg.ateButton, `${meal}_ate`);
    }
    this.state.save();
  }

  // ---- Ар минут сайын: кайра жиберүү логикасы ----
  @Cron(CronExpression.EVERY_MINUTE)
  async tick() {
    const now = Date.now();
    for (const id of this.state.allRegisteredIds()) {
      const u = this.state.get(id);

      // Түшкүч: 30 мин өтүп, 4төн аз болсо кайра жибер
      const w = u.wake;
      if (!w.done && w.sent > 0 && w.sent < CONFIG.wake.maxSent) {
        if (now - w.lastSentAt >= CONFIG.wake.intervalMin * 60_000) {
          w.sent += 1;
          w.lastSentAt = now;
          await this.bot.send(id, CONFIG.wake.message, CONFIG.wake.button, 'wake');
        }
      }

      for (const meal of ['breakfast', 'lunch', 'dinner'] as MealKey[]) {
        const m = u[meal];
        if (m.step === 'ask') {
          if (m.sent < CONFIG.mealAsk.maxSent && now - m.lastSentAt >= CONFIG.mealAsk.intervalMin * 60_000) {
            m.sent += 1;
            m.lastSentAt = now;
            const cfg = CONFIG.meals[meal];
            await this.bot.send(id, cfg.askMessage, cfg.ateButton, `${meal}_ate`);
          }
        } else if (m.step === 'medicine') {
          if (m.sent < CONFIG.medicine.maxSent && now - m.lastSentAt >= CONFIG.medicine.intervalMin * 60_000) {
            m.sent += 1;
            m.lastSentAt = now;
            await this.bot.send(id, CONFIG.medicine.message, CONFIG.medicine.button, `${meal}_med`);
            if (m.sent >= CONFIG.medicine.maxSent) {
              // 3-учурдагы эскертүү жиберилгендиктен, медицина аяктады -> спорт
              m.step = 'sport';
              await this.bot.send(id, CONFIG.sport.message, CONFIG.sport.button, `${meal}_sport`);
            }
          }
        }
      }
    }
    this.state.save();
  }
}
