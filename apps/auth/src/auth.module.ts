import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common/database';
import { UserDocument, UserSchema } from './users/models/user.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from './users/users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './apps/auth/.env',
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.string().required(),
      TCP_PORT: Joi.number().required(),
      HTTP_PORT: Joi.number().required(),
    })
  }),
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: `${configService.get('JWT_EXPIRATION')}s` },
    }),
  }),
    DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
      playground: false,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy,UsersService, AuthResolver],
})
export class AuthModule { }
