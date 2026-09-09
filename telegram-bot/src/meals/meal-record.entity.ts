import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Тамак жегенде Telegram аркылуу жазылган чыгымдын жазуусу */
@Entity('meal_records')
export class MealRecord {
  @PrimaryGeneratedColumn()
  id: number;

  // bigint pg ичинде string кайтарат — User сыяктуу
  @Column({ type: 'bigint' })
  telegramId: string;

  /** YYYY-MM-DD форматы (Asia/Bishkek) */
  @Column({ length: 10 })
  date: string;

  @Column({ length: 20 })
  meal: 'breakfast' | 'lunch' | 'dinner';

  /** Сом менен, бүтүн сан */
  @Column({ type: 'int' })
  cost: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
