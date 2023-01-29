// collections/collections.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionHistoriesService } from 'src/collection-histories/collection-histories.service';
import { CollectionHistoryType } from 'src/collection-histories/enum/collection-history.enum';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
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
      name: _collection.name,
      symbol: _collection.symbol,
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
    match_?: FindOptionsWhere<Collection>,
  ): Promise<Collection[]> {
    const collections = await this.collectionRepository.find({
      where: match_,
    });
    return collections;
  }

  public async getCollection(
    where_: FindOptionsWhere<Collection>,
    relations_?: FindOptionsRelations<Collection>,
  ): Promise<Collection> {
    const collection = await this.collectionRepository
      .findOne({
        where: where_,
        relations: relations_,
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

  public async syncCollection(
    id_: string,
    address_: string,
  ): Promise<Collection> {
    const _collection = await this.collectionRepository.findOne({
      where: { id: id_ },
    });
    _collection.address = address_;
    const _collectionHistory = await this.collectionHistoriesService.create({
      name: _collection.name,
      symbol: _collection.symbol,
      type: CollectionHistoryType.sync,
      collection: _collection,
    });
    _collection.histories.push(_collectionHistory);
    const _upadtedCollection = await this.collectionRepository.save(
      _collection,
    );

    return _upadtedCollection;
  }
}
