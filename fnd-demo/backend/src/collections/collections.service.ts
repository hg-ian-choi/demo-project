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
    const _collection = this.collectionRepository.create({
      ...collection_,
      user: { id: user_.id },
    });
    const _result = await this.collectionRepository.save(_collection);
    await this.collectionHistoriesService.create({
      name: _result.name,
      symbol: _result.symbol,
      type: CollectionHistoryType.create,
      operator: { id: user_.id },
      collection: { id: _result.id },
    });
    return _result;
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
    if (collection?.user?.password) {
      delete collection.user.password;
    }
    return collection;
  }
}
