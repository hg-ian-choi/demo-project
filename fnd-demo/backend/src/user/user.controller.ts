import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  getUser(@Param('userId') _userId: string) {
    return this.userService.getUser(_userId);
  }
}
