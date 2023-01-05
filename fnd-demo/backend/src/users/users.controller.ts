// user/user.controller.ts

import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import Web3 from 'web3';
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
  private createUser(@Body() _user: CreateUserDto): Promise<User> {
    return this.usersService.createUser(_user);
  }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  /**
   * @description select Users
   * @param _userId
   * @returns User[]
   */
  @Get('/')
  private getUsers(
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
  private getUser(
    @Param('match') _match: FindOptionsWhere<User>,
  ): Promise<User> {
    return this.usersService.getUserWithoutPassword(_match);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/connectWallet')
  public async connectWallet(
    @GetUser() _user: User,
    @Body('wallet') _wallet: string,
    @Body('sign') _sign: string,
    @Res({ passthrough: true }) _res: Response,
  ) {
    let user: User = null;
    const web3 = new Web3(
      'https://mainnet.infura.io/v3/ef8917d7093a4c54b95cbfff266200bd',
    );
    const signer = web3.eth.accounts.recover(
      '\nYou are now signing to connect Metamask.\n\n & \n\n Connect Metamask account to your fnd-demo account!',
      _sign,
    );

    if (_wallet && _wallet === signer) {
      console.log('!!!');
      _user.wallet_address = _wallet;
      user = await this.usersService.connectWallet(_user);
    } else {
      throw new ConflictException(`Signer Not Match!`);
    }

    if (user) {
      _res.cookie('wallet', _user.wallet_address, {
        domain: this.configService.get<string>('domain'),
        path: '/',
        maxAge: _user.wallet_address ? 1800000 : 0,
        signed: false,
        secure: this.configService.get<string>('mode') === 'PROD',
        httpOnly: false,
      });

      return true;
    }

    return false;
  }
}
