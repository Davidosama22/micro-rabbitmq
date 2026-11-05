import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [ConfigModule.forRoot(
        {
            isGlobal: true,
            
        }
    ), MongooseModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
        }),
        inject: [ConfigService],
    }),
       ],
})
export class DatabaseModule {
    static forFeature(model: ModelDefinition[]) {
        return MongooseModule.forFeature(model);
    }
}
