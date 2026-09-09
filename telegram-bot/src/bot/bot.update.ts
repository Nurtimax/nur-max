import { InjectBot, On, Start, Update, Ctx } from 'nestjs-telegraf';
import { Injectable, Logger } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { CONFIG, MealKey } from '../config/config';
import { StateService } from '../users/state.service';
import { User } from '../users/entities/user.entity';
import { MealsService, todayKey } from '../meals/meals.service';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(
    private readonly state: StateService,
    private readonly meals: MealsService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    await this.state.register(chatId); // telegram chat id = логин: upsert
    await ctx.reply(CONFIG.startMessage);
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx: Context) {
    const cq = ctx.callbackQuery as any;
    const chatId = cq?.message?.chat?.id;
    const data: string = cq?.data;
    if (!chatId || !data) return;

    if (!(await this.state.isRegistered(chatId))) {
      await this.answer(ctx, 'Алдын ала /start басып катталыңыз');
      return;
    }

    const user = await this.state.get(chatId);
    const s = user.state;

    // Кайсы баскыч басылбасын, басылган билдирүүнү өчүрөбүз
    const removeButton = () => this.removeButton(ctx);

    // Тамактын суммасы: даяр баскычтар же "Башка сумма"
    if (data.startsWith('cost:') || data.startsWith('cost_custom:')) {
      const [, meal] = data.split(':');
      const key = meal as MealKey;
      if (!CONFIG.meals[key]) return;
      // Тек акыркы суроонун баскычтары иштейт — эскилерин жашырабыз
      if (s.awaitingCost?.meal !== key || cq?.message?.message_id !== s.awaitingCost?.msgId) {
        await removeButton();
        await this.answer(ctx);
        return;
      }
      if (data.startsWith('cost_custom:')) {
        // Текст менен киргизүү режими: баскычты албай, текстти күтөбүз
        s.awaitingCost = { meal: key, msgId: cq?.message?.message_id };
        await this.state.save(user);
        await ctx.editMessageText(CONFIG.cost.customPrompt).catch(() => undefined);
        await this.answer(ctx);
        return;
      }
      const amount = Number(data.split(':')[2]);
      if (!Number.isFinite(amount) || amount <= 0) return;
      await this.finishCost(ctx, chatId, user, key, amount);
      return;
    }

    switch (data) {
      case 'wake': {
        if (s.wake.done) return; // кайталап басуу — тек гана баскычты жашырабыз
        s.wake.done = true;
        await removeButton();
        await this.state.save(user);
        await this.answer(ctx, 'Турдуң ✅');
        return;
      }
      case 'breakfast_ate':
      case 'lunch_ate':
      case 'dinner_ate': {
        const meal = data.replace('_ate', '') as MealKey;
        if (s[meal].step !== 'ask') return;
        await removeButton();
        if (CONFIG.meals[meal].withMedicine) {
          s[meal].step = 'medicine';
          s[meal].sent = 0;
          s[meal].lastMsgId = await this.send(chatId, CONFIG.medicine.message, CONFIG.medicine.button, `${meal}_med`);
        } else {
          s[meal].step = 'sport';
          s[meal].sent = 0;
          s[meal].lastMsgId = await this.send(chatId, CONFIG.sport.message, CONFIG.sport.button, `${meal}_sport`);
        }
        // "Канча сомго жедиң?" деген суроону жиберебиз
        if (s.awaitingCost?.msgId) await this.deleteMessage(chatId, s.awaitingCost.msgId);
        s.awaitingCost = { meal, msgId: await this.askCost(chatId, meal) };
        await this.state.save(user);
        await this.answer(ctx, 'Жедиң ✅');
        return;
      }
      case 'breakfast_med': {
        if (s.breakfast.step !== 'medicine') return;
        await removeButton();
        s.breakfast.step = 'sport';
        s.breakfast.sent = 0;
        s.breakfast.lastMsgId = await this.send(chatId, CONFIG.sport.message, CONFIG.sport.button, 'breakfast_sport');
        await this.state.save(user);
        await this.answer(ctx, 'Ичтиң ✅');
        return;
      }
      case 'breakfast_sport':
      case 'lunch_sport':
      case 'dinner_sport': {
        const meal = data.replace('_sport', '') as MealKey;
        if (s[meal].step !== 'sport') return;
        s[meal].step = 'done';
        await removeButton();
        await this.state.save(user);
        await this.answer(ctx, 'Кылдың ✅');
        return;
      }
      default:
        await this.answer(ctx);
        return;
    }
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const chatId = message?.chat?.id;
    const text: string = message?.text ?? '';
    if (!chatId || !text) return;
    if (!(await this.state.isRegistered(chatId))) return;

    if (text.trim().startsWith('/today')) {
      await this.replyToday(ctx, chatId);
      return;
    }

    // "Башка сумма"дан кийин жазылган текст — сумма катары кабыл алабыз
    const user = await this.state.get(chatId);
    const pending = user.state.awaitingCost;
    if (!pending) return;

    const value = Number(text.replace(/\s/g, '').replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) {
      await ctx.reply(CONFIG.cost.invalidAmount);
      return;
    }

    await this.meals.create(chatId, pending.meal as MealKey, value);
    user.state.awaitingCost = null;
    await this.state.save(user);
    // Суроону жоопко айлантабыз
    await this.bot.telegram
      .editMessageText(chatId, pending.msgId, undefined, `${CONFIG.meals[pending.meal as MealKey].label}: ${Math.round(value)} сом ✅`)
      .catch(() => undefined);
  }

  // Бүгүнкү тамактардын тизмеси жана жалпы суммасы
  private async replyToday(ctx: Context, chatId: number) {
    const key = todayKey();
    const records = await this.meals.findByRange(String(chatId), key, key);
    if (!records.length) {
      await ctx.reply(CONFIG.cost.todayEmpty);
      return;
    }
    const lines = records.map((r) => `${CONFIG.meals[r.meal].label}: ${r.cost} сом`);
    const total = records.reduce((sum, r) => sum + r.cost, 0);
    await ctx.reply(`Бүгүн:\n${lines.join('\n')}\n\nЖалпы: ${total} сом`);
  }

  // Сумманы сактап, суроону жоопко айлантат
  private async finishCost(ctx: Context, chatId: number, user: User, meal: MealKey, amount: number) {
    await this.meals.create(chatId, meal, amount);
    user.state.awaitingCost = null;
    await this.state.save(user);
    await ctx
      .editMessageText(`${CONFIG.meals[meal].label}: ${Math.round(amount)} сом ✅`)
      .catch(() => undefined);
    await this.answer(ctx, CONFIG.cost.savedToast);
  }

  // "Канча сомго жедиң?" суроосун жиберип, message_id кайтарат
  private async askCost(chatId: number, meal: MealKey): Promise<number | undefined> {
    const buttons = [
      ...CONFIG.cost.amounts.map((amount) => Markup.button.callback(`${amount} сом`, `cost:${meal}:${amount}`)),
      Markup.button.callback(CONFIG.cost.customButton, `cost_custom:${meal}`),
    ];
    const rows = [];
    for (let i = 0; i < buttons.length; i += 3) rows.push(buttons.slice(i, i + 3));
    try {
      const msg = await this.bot.telegram.sendMessage(chatId, CONFIG.cost.message, Markup.inlineKeyboard(rows));
      return msg.message_id;
    } catch (e) {
      this.logger.warn(`Cost question failed to ${chatId}: ${e.message}`);
      return undefined;
    }
  }

  // Басылган билдирүүнү өчүрөт; өчпөй калса (эски билдирүү) баскычты гана алат
  private async removeButton(ctx: Context) {
    try {
      await ctx.deleteMessage();
    } catch {
      await ctx.editMessageReplyMarkup(undefined).catch(() => undefined);
    }
  }

  private async answer(ctx: Context, text?: string) {
    await ctx.answerCbQuery(text).catch(() => undefined);
  }

  // Жиберип, message_id кайтарат (кайра эскертүү жибергенде мурункусун өчүрүү үчүн)
  async send(chatId: number, text: string, button: string, callbackData: string): Promise<number | undefined> {
    try {
      const msg = await this.bot.telegram.sendMessage(
        chatId,
        text,
        Markup.inlineKeyboard([Markup.button.callback(button, callbackData)]),
      );
      return msg.message_id;
    } catch (e) {
      this.logger.warn(`Send failed to ${chatId}: ${e.message}`);
      return undefined;
    }
  }

  async deleteMessage(chatId: number, messageId?: number): Promise<void> {
    if (!messageId) return;
    await this.bot.telegram.deleteMessage(chatId, messageId).catch(() => undefined);
  }
}
