// users/users.controller.ts

import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  /**
   * @description insert User
   * @param _user
   * @returns User
   */
  @Post('/')
  private async createUser(
    @Body('user') user_: CreateUserDto,
    @Body('sign') sign_: string,
  ): Promise<User> {
    return this.usersService.createUser(user_, sign_);
  }

  // @Post('/metamask/signup')
  // private createUserWithMetamask(@Body() _user: CreateUserDto): Promise<User> {
  //   return this.usersService.createUser(_user);
  // }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  /**
   * @description select Users
   * @param _userId
   * @returns User[]
   */
  @Get('/')
  private async getUsers(
    @Body('match') _match: FindOptionsWhere<User>,
    @Body('sort') _sort: FindOptionsOrder<User>,
  ): Promise<User[]> {
    return this.usersService.getUsers(_match, _sort);
  }

  /**
   * @description select one User
   * @param _userId
   * @returns User
   */
  @Get('/:match')
  private async getUser(
    @Param('match') _match: FindOptionsWhere<User>,
  ): Promise<User> {
    return this.usersService.getUser(_match);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/connectWallet')
  private async connectWallet(
    @GetUser() _user: User,
    @Body('wallet') _wallet: string,
    @Body('sign') _sign: string,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const user = this.usersService.connectWallet(_user, _wallet, _sign);
    if (user) {
      _res.cookie('wallet', _user.address, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: _user.address ? 1800000 : 0,
        signed: false,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: false,
      });

      return true;
    }

    return false;
  }
}
