import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { SigninDto } from '../dto/signin.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class WalletStrategy extends PassportStrategy(Strategy, 'wallet') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'wallet' });
  }

  async validate(wallet: string): Promise<User> {
    const _user: SigninDto = { wallet_address: wallet };
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
