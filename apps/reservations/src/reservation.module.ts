import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { DatabaseModule } from '@app/common/database';
import { ReservationRepo } from './reservation.repo';
import { ReservationDocument, ReservationSchema } from './entities/reservation.schema';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants/service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ReservationResolver } from './reservation.resolver';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]), LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/reservations/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_SERVICE_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_SERVICE_PORT: Joi.number().required(),
      }),

    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBIT_MQ_URI')],
            queue: 'auth_queue',
          },

        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBIT_MQ_URI')],
            queue: 'payments_queue',
          },

        }),
        inject: [ConfigService],
      }
    ]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
      playground: false,
      context: ({ req, res }) => ({ req, res }),
    }),

  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepo, ReservationResolver],
})
export class ReservationModule { }
