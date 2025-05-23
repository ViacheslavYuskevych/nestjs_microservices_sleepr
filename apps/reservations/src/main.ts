import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ReservationsModule } from './reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || '3001';

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.listen(port);
}

bootstrap();
