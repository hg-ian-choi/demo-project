// products/products.controller.ts

import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
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
  IsNull,
  Not,
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
    return this.getProducts(
      { ...where_, token_id: Not(IsNull()) },
      order_,
      relations_,
    );
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
    @Body('edition', ParseIntPipe) edition_: number,
    @Body('description') description_?: string,
    @Body('collectionId') collectionId_?: string,
  ): Promise<Product> {
    const createProductDto: CreateProductDto = {
      name: name_,
      description: description_,
    };
    return this.productsService.createProduct(
      user_,
      file_,
      edition_,
      collectionId_,
      createProductDto,
    );
  }
}
