import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
 
  const configService = app.get(ConfigService);
   app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBIT_MQ_URI')],
      queue: 'payments_queue',
    },
  })
  app.useLogger(app.get(Logger))
  await app.startAllMicroservices();
}
bootstrap();
