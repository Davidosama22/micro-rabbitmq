import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBIT_MQ_URI')],
      queue: 'auth_queue',
    },
  })
  
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT') ?? 3001);
}
bootstrap();
