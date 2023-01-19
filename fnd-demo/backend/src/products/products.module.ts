// products/products.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';

@Module({
  imports: [Product],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
