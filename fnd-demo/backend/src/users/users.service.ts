// user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  /**
   * @description insert User
   * @param _user
   * @returns User
   */
  async createUser(_user: CreateUserDto): Promise<User> {
    const username = _user.email.split('@')[0];
    const user = this.usersRepository.create({ ..._user, username: username });
    await this.usersRepository.save(user);
    return user;
  }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  /**
   *@description select one User
   * @param _userId
   * @returns User
   */
  async getUser(_match: FindOptionsWhere<User>): Promise<User> {
    console.log('!!!!!');
    return await this.usersRepository.findOne({ where: _match });
  }
}
