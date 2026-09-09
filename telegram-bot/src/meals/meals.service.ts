import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealKey } from '../config/config';
import { MealRecord } from './meal-record.entity';

/** Asia/Bishkek боюнча бүгүнкү күн: YYYY-MM-DD (процесс TZ=Asia/Bishkek менен иштейт) */
export const todayKey = (base: Date = new Date()): string => {
  const month = `${base.getMonth() + 1}`.padStart(2, '0');
  const day = `${base.getDate()}`.padStart(2, '0');
  return `${base.getFullYear()}-${month}-${day}`;
};

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(MealRecord) private readonly repo: Repository<MealRecord>,
  ) {}

  async create(telegramId: number, meal: MealKey, cost: number): Promise<MealRecord> {
    const record = this.repo.create({
      telegramId: String(telegramId),
      date: todayKey(),
      meal,
      cost: Math.round(cost),
    });
    return this.repo.save(record);
  }

  // YYYY-MM-DD салыштыруу строка түрүндө — алгачкы/аягы менен чектөө иштейт
  async findByRange(telegramId: string, from?: string, to?: string): Promise<MealRecord[]> {
    const qb = this.repo
      .createQueryBuilder('r')
      .where('r.telegramId = :telegramId', { telegramId })
      .orderBy('r.date', 'ASC')
      .addOrderBy('r.id', 'ASC');
    if (from) qb.andWhere('r.date >= :from', { from });
    if (to) qb.andWhere('r.date <= :to', { to });
    return qb.getMany();
  }
}
