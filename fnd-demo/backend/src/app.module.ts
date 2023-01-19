// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CollectionsModule } from './collections/collections.module';
import { Web3Module } from './web3/web3.module';
import { ProductsModule } from './products/products.module';
import { EditionsModule } from './editions/editions.module';
import { HistoriesModule } from './histories/histories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        MODE: Joi.string().required(),
        SSL: Joi.string().required(),
        DOMAIN: Joi.string().required(),
        PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRESIN: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        SIGNUP_MESSAGE: Joi.string().required(),
        SIGNIN_MESSAGE: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('mode') === 'DEV',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    CollectionsModule,
    Web3Module,
    ProductsModule,
    EditionsModule,
    HistoriesModule,
  ],
})
export class AppModule {}
