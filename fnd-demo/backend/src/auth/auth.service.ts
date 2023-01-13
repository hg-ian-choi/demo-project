// auth/auth.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Web3Service } from 'src/web3/web3.service';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly web3Service: Web3Service,
  ) {}

  async validateUser(_user: SigninDto): Promise<User> {
    let user: User;
    if (_user.password.startsWith('0x')) {
      const signer = await this.web3Service.getSignerFromSign(_user.password);
      user = await this.usersService.getUserWithoutPassword({
        address: signer.toLowerCase(),
      });
      return user;
    } else {
      user = await this.usersService.getUser({ email: _user.email });
      if (user) {
        if (_user.password === user.password) {
          const { password, ...result } = user;
          return result;
        }
        throw new ForbiddenException(`Wrong password`);
      }
    }
    return null;
  }

  async signIn(_user: User): Promise<string> {
    const paylod: User = {
      id: _user.id,
      email: _user.email,
      username: _user.username,
    };

    return this.jwtService.sign(paylod);
  }
}
