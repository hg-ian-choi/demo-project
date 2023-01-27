// auth/strategies/local.strategy.ts

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SigninDto } from '../dto/signin.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  private async validate(email: string, password: string): Promise<User> {
    const _user: SigninDto = { email, password };
    const user = await this.authService.validateUser(_user);
    if (user) {
      return user;
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No such User',
    });
  }
}
