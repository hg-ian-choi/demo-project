import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionHistory } from './collection-histories.entity';

@Injectable()
export class CollectionHistoriesService {
  constructor(
    @InjectRepository(CollectionHistory)
    private readonly collectionHistoryRepository: Repository<CollectionHistory>,
  ) {}

  public async create(
    collectionHistory_: CollectionHistory,
  ): Promise<CollectionHistory> {
    const _collectionHistory =
      this.collectionHistoryRepository.create(collectionHistory_);
    const _result = await this.collectionHistoryRepository.save(
      _collectionHistory,
    );
    return _result;
  }

  public async sync() {
    return;
  }
}
