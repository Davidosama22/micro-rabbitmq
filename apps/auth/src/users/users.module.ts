import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common/database';
import { UserRepo } from './user.repo';
import { UserDocument, UserSchema } from './models/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/service';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
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
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepo, UsersResolver],
  exports: [UsersService, UserRepo],
})
export class UsersModule {}
