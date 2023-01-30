// collections/collections.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionHistoriesService } from 'src/collection-histories/collection-histories.service';
import { CollectionHistoryType } from 'src/collection-histories/enum/collection-history.enum';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Web3Service } from 'src/web3/web3.service';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import factoryABI from '../web3/abis/fund.abi.json';
import { AbiItem } from '../web3/interfaces/abi.interfaces';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
    private readonly usersService: UsersService,
    private readonly collectionHistoriesService: CollectionHistoriesService,
  ) {}

  public async createCollection(
    user_: User,
    collection_: CreateCollectionDto,
  ): Promise<Collection> {
    const _collectionObject = this.collectionRepository.create({
      ...collection_,
      owner: { id: user_.id },
    });
    const _collection = await this.collectionRepository.save(_collectionObject);
    const _collectionHistory = await this.collectionHistoriesService.create({
      type: CollectionHistoryType.create,
      collection: _collection,
    });
    const _upadtedCollection = await this.collectionRepository.save({
      ..._collection,
      histories: [_collectionHistory],
    });

    return _upadtedCollection;
  }

  public async getCollections(
    where_?: FindOptionsWhere<Collection>,
    relations_?: FindOptionsRelations<Collection>,
    select_?: FindOptionsSelect<Collection>,
    order_?: FindOptionsOrder<Collection>,
  ): Promise<Collection[]> {
    const collections = await this.collectionRepository.find({
      where: where_,
      relations: relations_,
      order: order_,
      select: select_,
    });
    return collections;
  }

  public async getCollection(
    where_: FindOptionsWhere<Collection>,
    relations_?: FindOptionsRelations<Collection>,
    select_?: FindOptionsSelect<Collection>,
  ): Promise<Collection> {
    const collection = await this.collectionRepository
      .findOne({
        where: where_,
        relations: relations_,
        select: select_,
      })
      .then((collection_: Collection) => {
        collection_.products = collection_.products.filter(
          (product_: Product) => product_.token_id && true,
        );
        return collection_;
      });
    if (collection?.owner?.password) {
      delete collection.owner.password;
    }
    return collection;
  }

  public async syncCollection(id_: string, address_: string): Promise<void> {
    const _collection = await this.getCollection({ id: id_ }, { owner: true });
    _collection.address = address_;
    const _collectionHistory = await this.collectionHistoriesService.create({
      type: CollectionHistoryType.sync,
      collection: _collection,
    });
    _collection.histories.push(_collectionHistory);
    await this.collectionRepository.save(_collection);
  }

  public async checkCollectionSync(userId_: string): Promise<void> {
    const _nonsyncCollections = await this.getCollections(
      {
        owner: { id: userId_ },
        address: null,
      },
      { owner: true },
    );

    if (_nonsyncCollections) {
      const contractInstance = await this.web3Service.getContractInstance(
        factoryABI as AbiItem[],
        this.configService.get<string>('web3.factory'),
      );
      for await (const _nonsyncCollection of _nonsyncCollections) {
        try {
          const _events = await contractInstance
            .getPastEvents('cloneEvent', {
              topics: [
                ,
                this.web3Service.sha3(_nonsyncCollection.id),
                this.web3Service.get64LengthAddress(
                  _nonsyncCollection.owner.address,
                ),
              ],
              fromBlock: 0,
              toBlock: 'latest',
            })
            .then((events_: any) => events_)
            .catch(() => null);
          if (_events) {
            const _event = _events[0];
            const _creator = _event.returnValues.creator;
            const _newClone = _event.returnValues.newClone;
            console.log('_creator', _creator);
            console.log('_newClone', _newClone);
          }
        } catch (error_: any) {
          console.log('[getPastEvents error_] => ', error_);
          return;
        }
      }
    }
  }
}
