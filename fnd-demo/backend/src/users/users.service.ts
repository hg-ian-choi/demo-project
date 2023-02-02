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
  FindOptionsSelect,
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
  public async findUserList(
    where_?: FindOptionsWhere<User>,
    relations_?: FindOptionsRelations<User>,
    order_?: FindOptionsOrder<User>,
    select_?: FindOptionsSelect<User>,
  ): Promise<User[]> {
    return await this.getUsers(where_, relations_, order_, select_);
  }

  /**
   *@description get one User (for sign in)
   * @param _userId
   * @returns User
   */
  public async findOneUser(
    where_: FindOptionsWhere<User>,
    relations_?: FindOptionsRelations<User>,
    select_?: FindOptionsSelect<User>,
  ): Promise<User> {
    return this.getUser(where_, relations_, select_);
  }

  /**
   * @description get User without password (for HTTP.GET)
   * @param _match
   * @returns User
   */
  public async findOneUserWithPassword(
    where_: FindOptionsWhere<User>,
  ): Promise<User> {
    return this.getUser(where_, null, {
      id: true,
      username: true,
      address: true,
      password: true,
    });
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
      _user.address = _wallet.toLowerCase();
      return this.usersRepository.save(user);
    } else {
      throw new ConflictException(`Signer Not Match!`);
    }
  }

  /*******************************************************************************************
   ************************************ private functions ************************************
   *******************************************************************************************/
  /**
   * @description get Users
   * @param where
   * @param relations
   * @param order
   * @param select
   * @returns User[]
   */
  private async getUsers(
    where_?: FindOptionsWhere<User>,
    relations_?: FindOptionsRelations<User>,
    order_?: FindOptionsOrder<User>,
    select_?: FindOptionsSelect<User>,
  ): Promise<User[]> {
    return this.usersRepository.find({
      select: select_,
      where: where_,
      order: order_,
      relations: relations_,
    });
  }

  /**
   * @description get User
   * @param where
   * @param relations
   * @param select
   * @returns User
   */
  private async getUser(
    where_: FindOptionsWhere<User>,
    relations_?: FindOptionsRelations<User>,
    select_?: FindOptionsSelect<User>,
  ): Promise<User> {
    return this.usersRepository.findOne({
      where: where_,
      relations: relations_,
      select: select_,
    });
  }
}
