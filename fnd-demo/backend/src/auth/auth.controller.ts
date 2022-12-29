import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/api/auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signin(@Req() _req: any): Promise<User> {
    console.log('There runs the signin method', _req.user);
    return _req.user;
  }
}
