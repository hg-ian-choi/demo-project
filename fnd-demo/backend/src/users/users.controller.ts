// user/user.controller.ts

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  /**
   * @description insert User
   * @param _user
   * @returns User
   */
  @Post('/')
  createUser(@Body() _user: CreateUserDto): Promise<User> {
    return this.usersService.createUser(_user);
  }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  /**
   * @description select one User
   * @param _userId
   * @returns User
   */
  @Get('/:userId')
  getUser(@Param('match') _match: FindOptionsWhere<User>): Promise<User> {
    return this.usersService.getUser(_match);
  }
}
