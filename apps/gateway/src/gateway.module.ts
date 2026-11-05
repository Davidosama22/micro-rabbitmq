import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import * as Joi from 'joi';

interface GatewayContext {
  req?: Request;
  res?: Response;
}

interface SubgraphResponseHeaders {
  get(name: string): string | null;
  raw?: () => Record<string, string[]>;
}

function getSetCookieHeaders(headers?: SubgraphResponseHeaders): string[] {
  if (!headers) {
    return [];
  }
  const cookies = headers.raw?.()['set-cookie'];
  if (cookies?.length) {
    return cookies;
  }
  const cookie = headers.get('set-cookie');
  return cookie ? [cookie] : [];
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_URL: Joi.string().uri().required(),
        RESERVATIONS_URL: Joi.string().uri().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        server: {
          graphiql: true,
          context: ({ req, res }: GatewayContext) => ({ req, res }),
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'auth', url: configService.getOrThrow<string>('AUTH_URL') },
              {
                name: 'reservations',
                url: configService.getOrThrow<string>('RESERVATIONS_URL'),
              },
            ],
          }),
          buildService: ({ url }) =>
            new RemoteGraphQLDataSource<GatewayContext>({
              url,
              willSendRequest({ request, context }) {
                const cookie = context.req?.headers.cookie;
                if (cookie) {
                  request.http?.headers.set('cookie', cookie);
                }
              },
              didReceiveResponse({ response, context }) {
                const cookies = getSetCookieHeaders(response.http?.headers);
                if (cookies.length && context.res) {
                  context.res.append('Set-Cookie', cookies);
                }
                return response;
              },
            }),
        },
      }),
    }),
  ],
})
export class GatewayModule {}
