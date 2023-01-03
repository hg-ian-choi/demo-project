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
  public async createUser(_user: CreateUserDto): Promise<User> {
    const username = _user.email.split('@')[0];
    const user = this.usersRepository.create({ ..._user, username: username });
    await this.usersRepository.save(user);
    return user;
  }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  /**
   *@description get Users without password
   * @param _userId
   * @returns User
   */
  public async getUsers(
    _match?: FindOptionsWhere<User>,
    _sort?: FindOptionsOrder<User>,
  ): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: _match,
      order: _sort,
    });
    const result = users.map((_value: User) => {
      const { password, ...rest } = _value;
      return rest;
    });
    return result;
  }

  /**
   *@description get one User (for sign in)
   * @param _userId
   * @returns User
   */
  public async getUser(_match: FindOptionsWhere<User>): Promise<User> {
    let user = await this.usersRepository.findOne({ where: _match });
    if (!user) {
      user = await this.usersRepository
        .findOne({ where: _match })
        .catch(() => null);
    }
    return user;
  }

  /**
   * @description get User without password (for HTTP.GET)
   * @param _match
   * @returns User
   */
  public async getUserWithoutPassword(
    _match: FindOptionsWhere<User>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: _match });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return user;
  }

  public async connectWallet(_user: User) {
    const user = this.usersRepository.create(_user);
    return await this.usersRepository.save(user);
  }
}
