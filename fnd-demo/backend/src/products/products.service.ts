// products/products.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Edition } from 'src/editions/edition.entity';
import { EditionsService } from 'src/editions/editions.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
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
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
    private readonly editionsService: EditionsService,
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
      where: { ...where_, show: true },
      order: order_,
      relations: relations_,
    });
  }

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  async createProduct(
    user_: User,
    file_: Express.Multer.File,
    edition_: string,
    collectionId_: string,
    product_: CreateProductDto,
  ): Promise<Product> {
    if (!file_) {
      throw new ForbiddenException('Image not found!');
    }
    const _user = await this.usersService.findOneUser(
      { id: user_.id, collections: { id: collectionId_ } },
      { collections: true },
    );
    const _productObject = this.productRepository.create({
      ...product_,
      editions: [],
    });
    const _path = await this.commonService.awsUploadFile(
      `${_user.username}/${_user.collections[0].name}/image`,
      file_,
    );
    _productObject.image = this.configService
      .get<string>('s3Path')
      .concat('/')
      .concat(_path);
    const _product = await this.productRepository.save(_productObject);
    const _editionsArray = Array.from(Array(parseInt(edition_)).keys());
    for await (const index_ of _editionsArray) {
      const _edition = await this.editionsService.create(_user, _product);
      _product.editions.push(_edition);
    }
    await this.productRepository.save(_product);
    return _product;
  }
}
