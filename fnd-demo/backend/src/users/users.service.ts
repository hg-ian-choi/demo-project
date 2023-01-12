// users/users.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Web3Service } from 'src/web3/web3.service';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import Web3 from 'web3';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
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
    const signer = await this.web3Service.getSignerFromSign(_user.address);
    const user = this.usersRepository.create({
      ..._user,
      username: username,
      address: signer.toLowerCase(),
    });
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

  public async connectWallet(
    _user: User,
    _wallet: string,
    _sign: string,
  ): Promise<User> {
    const user = this.usersRepository.create(_user);
    const signer = await this.web3Service.getSignerFromSign(_sign);
    if (_wallet && _wallet === signer) {
      _user.address = _wallet;
      await this.usersRepository.save(user);
    } else {
      throw new ConflictException(`Signer Not Match!`);
    }

    return;
  }
}
