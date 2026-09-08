import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CONFIG } from './config';
import * as fs from 'fs';
import * as path from 'path';

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

export interface UserState {
  registered: boolean;
  wake: WakeState;
  breakfast: MealState;
  lunch: MealState;
  dinner: MealState;
}

function freshUser(): UserState {
  const meal = (): MealState => ({ step: 'idle', sent: 0, lastSentAt: 0 });
  return {
    registered: false,
    wake: { done: false, sent: 0, lastSentAt: 0 },
    breakfast: meal(),
    lunch: meal(),
    dinner: meal(),
  };
}

@Injectable()
export class StateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StateService.name);
  private readonly file = path.join(process.cwd(), CONFIG.dataFile);
  private users = new Map<number, UserState>();

  onModuleInit() {
    this.load();
  }

  onModuleDestroy() {
    this.save();
  }

  get(chatId: number): UserState {
    if (!this.users.has(chatId)) {
      this.users.set(chatId, freshUser());
    }
    return this.users.get(chatId);
  }

  register(chatId: number) {
    const u = this.get(chatId);
    u.registered = true;
    this.save();
  }

  isRegistered(chatId: number): boolean {
    return this.users.get(chatId)?.registered === true;
  }

  allRegisteredIds(): number[] {
    return [...this.users.entries()].filter(([, u]) => u.registered).map(([id]) => id);
  }

  private load() {
    try {
      if (fs.existsSync(this.file)) {
        const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        for (const [id, saved] of Object.entries<any>(raw)) {
          const u = freshUser();
          this.users.set(Number(id), { ...u, ...saved });
        }
        this.logger.log(`Loaded state for ${this.users.size} chat(s)`);
      }
    } catch (e) {
      this.logger.warn(`Could not load state: ${e.message}`);
    }
  }

  save() {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const obj = Object.fromEntries(this.users.entries());
      fs.writeFileSync(this.file, JSON.stringify(obj, null, 2));
    } catch (e) {
      this.logger.warn(`Could not save state: ${e.message}`);
    }
  }
}
