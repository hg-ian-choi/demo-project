// products/products.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  @Get('/')
  private async getProducts(
    @Body('where') where_?: FindOptionsWhere<Product>,
    @Body('order') order_?: FindOptionsOrder<Product>,
    @Body('relations') relations_?: FindOptionsRelations<Product>,
  ): Promise<Product[]> {
    return this.productsService.getProducts(where_, order_, relations_);
  }

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/')
  private async createProduct(
    @UploadedFile() file_: Express.Multer.File,
    @GetUser() user_: User,
    @Body('name') name_: string,
    @Body('edition') edition_: string,
    @Body('description') description_?: string,
    @Body('collectionId') collectionId_?: string,
  ): Promise<Product> {
    const _product: CreateProductDto = {
      name: name_,
      description: description_,
      token_id: null,
      creator: { id: user_.id },
      collection: { id: collectionId_ },
    };
    return this.productsService.createProduct(
      user_,
      file_,
      edition_,
      collectionId_,
      _product,
    );
  }
}
