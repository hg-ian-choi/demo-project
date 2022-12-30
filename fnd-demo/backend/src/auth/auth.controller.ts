import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
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
    @Req() _req: any,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<string> {
    const accessToken = await this.authService.signIn(_req.user);
    console.log('accessToken', accessToken);
    await _res
      .cookie('at_auth', accessToken, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: 1800000,
        signed: true,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: true,
      })
      .cookie('loginId', _req.user.id, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: 1800000,
        signed: false,
        secure: false,
        httpOnly: false,
      })
      .cookie('username', _req.user.username, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: 1800000,
        signed: false,
        secure: false,
        httpOnly: false,
      });
    return accessToken;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() _req: any) {
    return _req.user;
  }
}
