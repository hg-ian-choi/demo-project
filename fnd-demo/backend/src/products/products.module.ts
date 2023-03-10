// products/products.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { EditionsModule } from 'src/editions/editions.module';
import { ProductHistoriesModule } from 'src/product-histories/product-histories.module';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CommonModule,
    UsersModule,
    EditionsModule,
    ProductHistoriesModule,
    Web3Module,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
