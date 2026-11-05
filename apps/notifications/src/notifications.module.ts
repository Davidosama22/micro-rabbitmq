import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/notifications/.env',

      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),
        SMTP_USER: Joi.string().email().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      }),
    }),
     LoggerModule.forRoot(),
  ],

  controllers: [NotificationsController],

  providers: [NotificationsService],
})
export class NotificationsModule {}