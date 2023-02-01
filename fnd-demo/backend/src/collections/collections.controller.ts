// collections/collections.controller.ts

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
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
  private async getUserCollections(
    @GetUser() user_: User,
  ): Promise<Collection[]> {
    await this.collectionsService.checkCollectionsSync(user_);
    return this.collectionsService.getValidCollections(user_);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:collection_id')
  private async getCollection(
    @Param('collection_id') collectionId_: string,
  ): Promise<Collection> {
    await this.collectionsService.checkProductsSync(collectionId_);
    return this.collectionsService.getValidCollection(
      { id: collectionId_ },
      { owner: true, histories: true, products: { editions: true } },
    );
  }

  /********************************************************************************
   ************************************ UPDATE ************************************
   ********************************************************************************/
  @UseGuards(JwtAuthGuard)
  @Patch('/:collection_id/sync')
  private async syncCollection(
    @Param('collection_id') collectionId_: string,
    @Body('address') address_: string,
    @Body('transactionHash') txnHash_: string,
  ): Promise<Collection> {
    return this.collectionsService.syncCollection(
      collectionId_,
      address_,
      txnHash_,
    );
  }
}
