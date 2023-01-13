// auth/auth.controller.ts

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(
    @GetUser() _user: User,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<object> {
    const accessToken = await this.authService.signIn(_user);
    _res
      .cookie('at_auth', accessToken, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: 1800000,
        signed: true,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: true,
      })
      .cookie('userId', _user.id, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: 1800000,
        signed: false,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: false,
      })
      .cookie('username', _user.username, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: 1800000,
        signed: false,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: false,
      })
      .cookie('wallet', _user.address, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: _user.address ? 1800000 : 0,
        signed: false,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: false,
      });
    return {
      userId: _user.id,
      username: _user.username,
      wallet: _user.address,
      _token: accessToken,
    };
  }

  // @Post('/signin/wallet')
  // async signInWithWallet(
  //   @GetUser() _user: User,
  //   @Res({ passthrough: true }) _res: Response,
  // ): Promise<object> {
  //   const accessToken = await this.authService.signIn(_user);
  //   _res
  //     .cookie('at_auth', accessToken, {
  //       domain: this.configService.get<string>('domain'),
  //       path: '/',
  //       maxAge: 1800000,
  //       signed: true,
  //       secure: this.configService.get<string>('mode') === 'PROD',
  //       httpOnly: true,
  //     })
  //     .cookie('userId', _user.id, {
  //       domain: this.configService.get<string>('domain'),
  //       path: '/',
  //       maxAge: 1800000,
  //       signed: false,
  //       secure: this.configService.get<string>('mode') === 'PROD',
  //       httpOnly: false,
  //     })
  //     .cookie('username', _user.username, {
  //       domain: this.configService.get<string>('domain'),
  //       path: '/',
  //       maxAge: 1800000,
  //       signed: false,
  //       secure: this.configService.get<string>('mode') === 'PROD',
  //       httpOnly: false,
  //     })
  //     .cookie('wallet', _user.address, {
  //       domain: this.configService.get<string>('domain'),
  //       path: '/',
  //       maxAge: 1800000,
  //       signed: false,
  //       secure: this.configService.get<string>('mode') === 'PROD',
  //       httpOnly: false,
  //     });
  //   return {
  //     userId: _user.id,
  //     username: _user.username,
  //     wallet: _user.address,
  //     _token: accessToken,
  //   };
  // }

  @Post('/signout')
  signOut(@Res({ passthrough: true }) _res: Response): boolean {
    _res
      .cookie('at_auth', '', { maxAge: 0 })
      .cookie('userId', '', { maxAge: 0 })
      .cookie('username', '', { maxAge: 0 })
      .cookie('wallet', '', { maxAge: 0 });
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@GetUser() _user: User) {
    return _user;
  }
}
