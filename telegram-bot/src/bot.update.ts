import { InjectBot, On, Start, Update, Ctx } from 'nestjs-telegraf';
import { Injectable, Logger } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { CONFIG, MealKey } from './config';
import { StateService } from './state.service';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(
    private readonly state: StateService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    this.state.register(chatId);
    await ctx.reply(CONFIG.startMessage);
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx: Context) {
    const cq = ctx.callbackQuery as any;
    const chatId = cq?.message?.chat?.id;
    const data: string = cq?.data;
    if (!chatId || !data) return;
    await ctx.answerCbQuery().catch(() => undefined);
    if (!this.state.isRegistered(chatId)) return;

    switch (data) {
      case 'wake':
        this.state.get(chatId).wake.done = true;
        break;
      case 'breakfast_ate':
        this.advanceToMedicine(chatId, 'breakfast');
        return;
      case 'lunch_ate':
      case 'dinner_ate':
        this.advanceToSport(chatId, data.replace('_ate', '') as MealKey);
        return;
      case 'breakfast_med':
        this.advanceToSport(chatId, 'breakfast');
        return;
      case 'breakfast_sport':
      case 'lunch_sport':
      case 'dinner_sport':
        this.state.get(chatId)[data.replace('_sport', '') as MealKey].step = 'done';
        break;
      default:
        return;
    }
    this.state.save();
  }

  private advanceToMedicine(chatId: number, meal: MealKey) {
    const m = this.state.get(chatId)[meal];
    m.step = 'medicine';
    m.sent = 0;
    this.state.save();
    this.send(chatId, CONFIG.medicine.message, CONFIG.medicine.button, `${meal}_med`);
  }

  private advanceToSport(chatId: number, meal: MealKey) {
    const m = this.state.get(chatId)[meal];
    m.step = 'sport';
    m.sent = 0;
    this.state.save();
    this.send(chatId, CONFIG.sport.message, CONFIG.sport.button, `${meal}_sport`);
  }

  async send(chatId: number, text: string, button: string, callbackData: string) {
    try {
      await this.bot.telegram.sendMessage(
        chatId,
        text,
        Markup.inlineKeyboard([Markup.button.callback(button, callbackData)]),
      );
    } catch (e) {
      this.logger.warn(`Send failed to ${chatId}: ${e.message}`);
    }
  }
}
