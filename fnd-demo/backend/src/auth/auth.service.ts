// auth/auth.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Web3Service } from 'src/web3/web3.service';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly web3Service: Web3Service,
  ) {}
  public async validateUser(user_: SigninDto): Promise<User> {
    if (user_.password.startsWith('0x')) {
      const signer = this.web3Service.getSignerFromSign(
        this.configService.get<string>('signInMessage'),
        user_.password,
      );
      const user = await this.usersService.findOneUser({
        address: signer.toLowerCase(),
      });
      return user;
    } else {
      const user = await this.usersService.findOneUserWithPassword({
        email: user_.email,
      });
      if (user) {
        if (user_.password === user.password) {
          delete user.password;
          return user;
        }
        throw new ForbiddenException(`Wrong password`);
      }
    }
  }

  public async signIn(_user: User): Promise<string> {
    const paylod: User = {
      id: _user.id,
      email: _user.email,
      username: _user.username,
    };

    return this.jwtService.sign(paylod);
  }
}
