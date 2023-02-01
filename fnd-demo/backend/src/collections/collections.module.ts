// collections/collections.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionHistoriesModule } from 'src/collection-histories/collection-histories.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { Web3Module } from 'src/web3/web3.module';
import { Collection } from './collection.entity';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    UsersModule,
    CollectionHistoriesModule,
    Web3Module,
    ProductsModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
