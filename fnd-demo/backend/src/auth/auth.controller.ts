import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(
    @Req() _req: any,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<{ access_token: string }> {
    const accessToken = await this.authService.signIn(_req.user);
    _res.cookie('at_auth', accessToken, {
      domain: 'localhost',
      path: '/',
      maxAge: null,
      signed: true,
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
