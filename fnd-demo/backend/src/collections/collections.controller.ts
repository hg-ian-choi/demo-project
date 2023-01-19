// collections/collections.controller.ts

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Collection } from './collection.entity';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('/api/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  @UseGuards(JwtAuthGuard)
  @Post('/')
  private async createCollection(
    @GetUser() user_: User,
    @Body() collection_: CreateCollectionDto,
  ): Promise<Collection> {
    if (user_.id) {
      return this.collectionsService.createCollection(user_, collection_);
    }
    throw new NotFoundException('User not found');
  }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUserCollections(@GetUser() _user: User): Promise<Collection[]> {
    const collections = await this.collectionsService.getUserCollections(
      _user.id,
    );
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
