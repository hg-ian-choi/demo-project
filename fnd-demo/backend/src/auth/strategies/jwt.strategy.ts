// auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (_request: Request) => {
          return _request.signedCookies.at_auth;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.jwtSecret'),
      passReqToCallback: true,
    });
  }

  private async validate(_req: Request, _payload: User): Promise<User> {
    const userId = _req.params.user_id;

    if (userId && userId !== _payload.id) {
      throw new UnauthorizedException(`Only user in person is allowed.`);
    }

    return _payload;
  }
}
