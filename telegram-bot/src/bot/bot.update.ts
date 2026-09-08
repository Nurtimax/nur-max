import { InjectBot, On, Start, Update, Ctx } from 'nestjs-telegraf';
import { Injectable, Logger } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { CONFIG, MealKey } from '../config/config';
import { StateService } from '../users/state.service';
import { UserState } from '../users/entities/user.entity';

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
    await this.state.register(chatId); // telegram chat id = логин: upsert
    await ctx.reply(CONFIG.startMessage);
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx: Context) {
    const cq = ctx.callbackQuery as any;
    const chatId = cq?.message?.chat?.id;
    const data: string = cq?.data;
    if (!chatId || !data) return;
    await ctx.answerCbQuery().catch(() => undefined);
    if (!(await this.state.isRegistered(chatId))) return;

    switch (data) {
      case 'wake':
        await this.mutate(chatId, (s) => {
          s.wake.done = true;
        });
        break;
      case 'breakfast_ate':
        await this.advanceToMedicine(chatId, 'breakfast');
        return;
      case 'lunch_ate':
      case 'dinner_ate':
        await this.advanceToSport(chatId, data.replace('_ate', '') as MealKey);
        return;
      case 'breakfast_med':
        await this.advanceToSport(chatId, 'breakfast');
        return;
      case 'breakfast_sport':
      case 'lunch_sport':
      case 'dinner_sport':
        await this.mutate(chatId, (s) => {
          s[data.replace('_sport', '') as MealKey].step = 'done';
        });
        break;
      default:
        return;
    }
  }

  // Колдонуучунун абалын өзгөртүп, базага сактоо
  private async mutate(chatId: number, fn: (s: UserState) => void) {
    const user = await this.state.get(chatId);
    fn(user.state);
    await this.state.save(user);
  }

  private async advanceToMedicine(chatId: number, meal: MealKey) {
    await this.mutate(chatId, (s) => {
      s[meal].step = 'medicine';
      s[meal].sent = 0;
    });
    await this.send(chatId, CONFIG.medicine.message, CONFIG.medicine.button, `${meal}_med`);
  }

  private async advanceToSport(chatId: number, meal: MealKey) {
    await this.mutate(chatId, (s) => {
      s[meal].step = 'sport';
      s[meal].sent = 0;
    });
    await this.send(chatId, CONFIG.sport.message, CONFIG.sport.button, `${meal}_sport`);
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
