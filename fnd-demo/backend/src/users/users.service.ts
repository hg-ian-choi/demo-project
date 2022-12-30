// user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
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
  async getUsers(
    _match?: FindOptionsWhere<User>,
    _sort?: FindOptionsOrder<User>,
  ): Promise<User[]> {
    return await this.usersRepository.find({ where: _match, order: _sort });
  }

  /**
   *@description select one User
   * @param _userId
   * @returns User
   */
  async getUser(_match: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { email: _match } });
    if (!user) {
      user = await this.usersRepository
        .findOne({ where: { id: _match } })
        .catch(() => null);
    }
    return user;
  }
}
