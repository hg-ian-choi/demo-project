import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(_user: SigninDto): Promise<User> {
    const user = await this.usersService.getUser(_user.email);
    if (user && _user.password === user.password) {
      const { password, ...result } = user;
      return result;
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
