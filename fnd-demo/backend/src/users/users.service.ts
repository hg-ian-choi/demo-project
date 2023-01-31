// users/users.service.ts

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Web3Service } from 'src/web3/web3.service';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
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
  public async createUser(user_: CreateUserDto, sign_: string): Promise<User> {
    const username = user_.email.split('@')[0];
    const signer = this.web3Service.getSignerFromSign(
      this.configService.get<string>('signUpMessage'),
      sign_,
    );
    if (signer.toLowerCase() === user_.address.toLowerCase()) {
      const user = this.usersRepository.create({
        ...user_,
        username: username,
        address: signer.toLowerCase(),
      });
      await this.usersRepository.save(user);
      return user;
    }
    throw new BadRequestException('Wrong Signer');
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
  public async getUser(
    where_?: FindOptionsWhere<User>,
    relations_?: FindOptionsRelations<User>,
  ): Promise<User> {
    const user = await this.usersRepository
      .findOne({ where: where_, relations: relations_ })
      .catch(() => {
        throw new NotFoundException();
      });
    return user;
  }

  /**
   * @description get User without password (for HTTP.GET)
   * @param _match
   * @returns User
   */
  public async getUserWithPassword(
    _where: FindOptionsWhere<User>,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        username: true,
        address: true,
        email: true,
        password: true,
      },
      where: _where,
    });
    return user;
  }

  public async connectWallet(
    _user: User,
    _wallet: string,
    _sign: string,
  ): Promise<User> {
    const user = this.usersRepository.create(_user);
    const signer = this.web3Service.getSignerFromSign(
      this.configService.get<string>('signInMessage'),
      _sign,
    );
    if (_wallet && _wallet === signer) {
      _user.address = _wallet;
      await this.usersRepository.save(user);
    } else {
      throw new ConflictException(`Signer Not Match!`);
    }

    return;
  }
}
