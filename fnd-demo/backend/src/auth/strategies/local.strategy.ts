// auth/strategies/local.strategy.ts

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SigninDto } from '../dto/signin.dto';
import { User } from 'src/users/user.entity';
import { CollectionsService } from 'src/collections/collections.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    private readonly collectionsService: CollectionsService,
  ) {
    super({ usernameField: 'email' });
  }

  private async validate(email_: string, password_: string): Promise<User> {
    const signinDto: SigninDto = { email: email_, password: password_ };
    const user = await this.authService.validateUser(signinDto);
    if (user) {
      return user;
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No such User',
    });
  }
}
