// products/products.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {}

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  async getProducts(
    where_?: FindOptionsWhere<Product>,
    order_?: FindOptionsOrder<Product>,
    relations_?: FindOptionsRelations<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find({
      where: where_,
      order: order_,
      relations: relations_,
    });
  }

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  async createProduct(
    file_: Express.Multer.File,
    product_: CreateProductDto,
  ): Promise<Product> {
    if (!file_) {
      throw new ForbiddenException('Image not found!');
    }
    product_.image = '';
    const product = this.productRepository.create(product_);
    await this.productRepository.save(product);
    return product;
  }
}
