// histories/histories.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductHistoriesService } from './product-histories.service';
import { ProductHistory } from './product-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductHistory])],
  providers: [ProductHistoriesService],
  exports: [ProductHistoriesService],
})
export class ProductHistoriesModule {}
