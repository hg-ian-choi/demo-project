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
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import factoryABI from '../web3/abis/factory.abi.json';
import { AbiItem } from '../web3/interfaces/abi.interfaces';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
    private readonly usersService: UsersService,
    private readonly collectionHistoriesService: CollectionHistoriesService,
    private readonly productsService: ProductsService,
  ) {}

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
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

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  public getValidCollections(user_: User): Promise<Collection[]> {
    return this._selectMany(
      {
        owner: { id: user_.id },
        address: Not(IsNull()),
      },
      { products: true },
    );
  }

  public async getValidCollection(
    where_: FindOptionsWhere<Collection>,
    relations_?: FindOptionsRelations<Collection>,
    select_?: FindOptionsSelect<Collection>,
  ): Promise<Collection> {
    const collection = await this._selectOne(where_, relations_, select_).then(
      (collection_: Collection) => {
        if (collection_?.products) {
          collection_.products = collection_.products.filter(
            (product_: Product) => product_.token_id && true,
          );
        }
        return collection_;
      },
    );
    if (collection?.owner?.password) {
      delete collection.owner.password;
    }
    return collection;
  }

  /******************************************************************************
   ************************************ UPDATE **********************************
   ******************************************************************************/
  /**
   * @description sync collection
   * @param id
   * @param address
   * @param transactionHash
   * @returns boolean
   */
  public async syncCollection(
    id_: string,
    address_: string,
    txnHash_: string,
  ): Promise<Collection> {
    try {
      const _collection = await this._selectOne(
        { id: id_ },
        {
          owner: true,
          histories: true,
        },
      );
      if (!_collection.address) {
        _collection.address = address_;
      }
      const _collectionHistory = await this.collectionHistoriesService.create({
        type: CollectionHistoryType.sync,
        txn_hash: txnHash_,
        collection: _collection,
      });
      _collection.histories.push(_collectionHistory);
      return this.collectionRepository.save(_collection);
    } catch (error_: any) {
      console.log('[collections.service.ts / syncCollection] => ', error_);
      return null;
    }
  }

  /******************************************************************************
   ************************************ CHECK ***********************************
   ******************************************************************************/
  public async checkCollectionsSync(user_: User): Promise<void> {
    const _nonsyncCollections = await this._selectMany(
      {
        owner: { id: user_.id },
        address: IsNull(),
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
          if (_events.length > 0) {
            const _event = _events[0];
            const _newClone = _event.returnValues.newClone;
            const _transactionHash = _event.transactionHash;
            await this.syncCollection(
              _nonsyncCollection.id,
              _newClone,
              _transactionHash,
            );
          } else {
            await this._delete({ id: _nonsyncCollection.id });
          }
        } catch (error_: any) {
          console.log('[getPastEvents error_] => ', error_);
        }
      }
    }
  }

  public async checkProductsSync(collectionId_: string): Promise<void> {
    await this.productsService.checkProductsSync(collectionId_);
  }

  /*******************************************************************************************
   ************************************ private functions ************************************
   *******************************************************************************************/
  /**
   * @description find Collections
   * @param select
   * @param where
   * @param order
   * @param relations
   * @returns Collection[]
   */
  private _selectMany(
    where_?: FindOptionsWhere<Collection>,
    relations_?: FindOptionsRelations<Collection>,
    order_?: FindOptionsOrder<Collection>,
    select_?: FindOptionsSelect<Collection>,
  ): Promise<Collection[]> {
    return this.collectionRepository.find({
      select: select_,
      where: where_,
      order: order_,
      relations: relations_,
    });
  }

  /**
   * @description find Collection
   * @param where
   * @param select
   * @param relations
   * @returns Collection
   */
  private _selectOne(
    where_: FindOptionsWhere<Collection>,
    relations_?: FindOptionsRelations<Collection>,
    select_?: FindOptionsSelect<Collection>,
  ): Promise<Collection> {
    return this.collectionRepository.findOne({
      select: select_,
      where: where_,
      relations: relations_,
    });
  }

  /**
   * @description delete Collection
   * @param collectionId
   */
  private async _delete(where_: FindOptionsWhere<Collection>): Promise<void> {
    await this.collectionRepository.delete(where_);
  }
}
