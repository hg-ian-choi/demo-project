// auth/auth.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CollectionsModule } from 'src/collections/collections.module';
import { UsersModule } from 'src/users/users.module';
import { Web3Module } from 'src/web3/web3.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.jwtExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    Web3Module,
    CollectionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
