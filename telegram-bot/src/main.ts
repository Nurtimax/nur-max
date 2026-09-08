import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { BotModule } from './bot/bot.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BotModule);
  app.enableShutdownHooks();
  new Logger('Bootstrap').log('Bot is running');
}
bootstrap();
