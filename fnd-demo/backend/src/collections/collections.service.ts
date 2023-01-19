// collections/collections.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly usersService: UsersService,
  ) {}

  async createCollection(
    user_: User,
    collection_: CreateCollectionDto,
  ): Promise<Collection> {
    const user = await this.usersService.getUser({ id: user_.id });
    const collection = this.collectionRepository.create(collection_);
    collection.user = user;
    await this.collectionRepository.save(collection);
    return collection;
  }

  async getUserCollections(userId_: string): Promise<Collection[]> {
    const collections = await this.collectionRepository.find({
      where: { user: { id: userId_ } },
    });
    return collections;
  }

  async getCollection(
    match_: FindOptionsWhere<Collection>,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: match_,
    });
    return collection;
  }
}
