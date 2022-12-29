import { Injectable } from '@nestjs/common';
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

  async validate(_paylod: User) {
    return { id: _paylod.id, email: _paylod.email, username: _paylod.username };
  }
}
