// collections/collections.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async getUserCollections(userId_: string): Promise<Collection[]> {
    const collections = await this.collectionRepository.find({
      where: { user: { id: userId_ } },
    });
    return collections;
  }
}
