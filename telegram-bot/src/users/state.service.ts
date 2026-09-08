import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserState, freshUser } from './entities/user.entity';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  // Көрсөтүлгөн chat id боюнча колдонуучуну табат же жаратат.
  // telegramId — колдонуучунун идентификатору (логин).
  async get(chatId: number): Promise<User> {
    const telegramId = String(chatId);
    let user = await this.repo.findOne({ where: { telegramId } });
    if (!user) {
      user = this.repo.create({ telegramId, state: freshUser() });
      await this.repo.save(user);
    }
    return user;
  }

  async save(user: User): Promise<void> {
    await this.repo.save(user);
  }

  async register(chatId: number): Promise<void> {
    const user = await this.get(chatId);
    if (!user.state.registered) {
      user.state.registered = true;
      user.registeredAt = new Date();
      await this.save(user);
    }
  }

  async isRegistered(chatId: number): Promise<boolean> {
    const user = await this.repo.findOne({ where: { telegramId: String(chatId) } });
    return user?.state?.registered === true;
  }

  async allRegisteredIds(): Promise<number[]> {
    const users = await this.repo.find();
    return users.filter((u) => u.state?.registered).map((u) => Number(u.telegramId));
  }
}
