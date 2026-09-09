import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { BotModule } from './bot/bot.module';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);
  app.setGlobalPrefix('api'); // фронт менен окшош: /api/meals/...
  app.enableCors(); // Netlify/локал фронттук доменден сурамдар үчүн
  app.enableShutdownHooks();
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  new Logger('Bootstrap').log(`Bot is running, API on :${port}/api`);
}
bootstrap();
