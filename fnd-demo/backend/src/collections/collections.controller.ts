import { Controller, Get, Param } from '@nestjs/common';
import { Collection } from './collection.entity';
import { CollectionsService } from './collections.service';

@Controller('/api/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('/user/:user_id')
  async getUserCollections(
    @Param('user_id') user_id: string,
  ): Promise<Collection[]> {
    console.log('user_id', user_id);
    return [new Collection()];
  }

  @Get('/:collection_id')
  async getCollectionById(
    @Param('collection_id') collection_id: string,
  ): Promise<Collection> {
    console.log('collection_id', collection_id);
    return new Collection();
  }
}
