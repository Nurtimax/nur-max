import { Controller, Get, Param, Query } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly meals: MealsService) {}

  // GET /api/meals/:telegramId?from=2026-09-01&to=2026-09-30
  @Get(':telegramId')
  async getRecords(
    @Param('telegramId') telegramId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const records = await this.meals.findByRange(telegramId, from, to);
    const total = records.reduce((sum, record) => sum + record.cost, 0);
    return { records, total };
  }
}
