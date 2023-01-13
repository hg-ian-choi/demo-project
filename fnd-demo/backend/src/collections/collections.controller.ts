import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Collection } from './collection.entity';
import { CollectionsService } from './collections.service';

@Controller('/api/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUserCollections(@GetUser() _user: User): Promise<Collection[]> {
    const collections = await this.collectionsService.getUserCollections(
      _user.id,
    );
    console.log('collections', collections);
    return collections;
  }

  @Get('/:collection_id')
  async getCollectionById(
    @Param('collection_id') collection_id: string,
  ): Promise<Collection> {
    console.log('collection_id', collection_id);
    return new Collection();
  }
}
