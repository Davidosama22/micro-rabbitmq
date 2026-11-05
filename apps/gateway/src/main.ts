import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
