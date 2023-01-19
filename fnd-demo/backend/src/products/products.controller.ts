// products/products.controller.ts

import { Controller, Get } from '@nestjs/common';
import { Product } from './product.entity';

@Controller('/products')
export class ProductsController {
  @Get('/')
  private async getProducts(): Promise<Product[]> {
    return [new Product()];
  }
}
