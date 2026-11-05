import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './apps/payments/.env',
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
      NOTIFICATIONS_HOST: Joi.string().required(),
      NOTIFICATIONS_PORT: Joi.number().required(),
      STRIPE_SECRET_KEY: Joi.string().required(),
      STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
    })
  }), ClientsModule.registerAsync([
    {
      name: NOTIFICATIONS_SERVICE,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.getOrThrow<string>('RABBIT_MQ_URI')],
          queue: 'notifications_queue',
        },
      }),
      inject: [ConfigService],
    }
  ]), LoggerModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule { }
