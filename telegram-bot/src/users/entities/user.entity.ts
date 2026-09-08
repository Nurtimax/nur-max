import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface MealState {
  step: 'idle' | 'ask' | 'medicine' | 'sport' | 'done';
  sent: number; // бул кадамда жиберилген билдирүүлөрдүн саны
  lastSentAt: number; // timestamp (ms)
}

export interface WakeState {
  done: boolean;
  sent: number;
  lastSentAt: number;
}

// Бул JSONB устунунда сакталат — .data/state.json мурдагы форматтын окшошу
export interface UserState {
  registered: boolean;
  wake: WakeState;
  breakfast: MealState;
  lunch: MealState;
  dinner: MealState;
}

export function freshUser(): UserState {
  const meal = (): MealState => ({ step: 'idle', sent: 0, lastSentAt: 0 });
  return {
    registered: false,
    wake: { done: false, sent: 0, lastSentAt: 0 },
    breakfast: meal(),
    lunch: meal(),
    dinner: meal(),
  };
}

// Telegram chat id — колдонуучунун жеке идентификатору ("логин").
// bigint pg ичинде string кайтарат, ошондуктан тип string.
@Entity('users')
export class User {
  @PrimaryColumn({ type: 'bigint' })
  telegramId: string;

  @Column({ type: 'jsonb' })
  state: UserState;

  @Column({ type: 'timestamptz', nullable: true })
  registeredAt: Date;
}
