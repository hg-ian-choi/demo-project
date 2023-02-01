// products/products.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { EditionsService } from 'src/editions/editions.service';
import { ProductHistoryType } from 'src/product-histories/enum/product-history.enum';
import { ProductHistoriesService } from 'src/product-histories/product-histories.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
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
    private readonly productHistoriesService: ProductHistoriesService,
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
      where: { ...where_ },
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
    edition_: number,
    collectionId_: string,
    createProductDto_: Product,
  ): Promise<Product> {
    if (!file_) {
      throw new ForbiddenException('Image not found!');
    }
    const user = await this.usersService.findOneUser(
      { id: user_.id, collections: { id: collectionId_ } },
      { collections: true },
    );
    if (!user.address) {
      throw new NotFoundException('User should connect metamask first!');
    }
    if (!user.collections[0].address) {
      throw new NotFoundException('User should create collection first!');
    }
    const imagePath = await this.commonService.awsUploadFile(
      `${user.username}/${user.collections[0].name}/image`,
      file_,
    );
    const fullImagePath = this.configService
      .get<string>('s3Path')
      .concat('/')
      .concat(imagePath);

    const metadata = {
      name: createProductDto_.name,
      describe: createProductDto_.description,
      image: fullImagePath,
      edition: edition_,
      creator: user_.address,
    };
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataPath = await this.commonService.awsUploadBuffer(
      `${user.username}/${user.collections[0].name}/metadata`,
      metadataBuffer,
    );
    const fullMetadataPath = this.configService
      .get<string>('s3Path')
      .concat('/')
      .concat(metadataPath);

    createProductDto_.metadata = fullMetadataPath;
    createProductDto_.image = fullImagePath;
    createProductDto_.creator = { id: user.id };
    createProductDto_.collection = { id: collectionId_ };
    createProductDto_.editions = [];
    createProductDto_.histories = [];

    const productObject = this._create(createProductDto_);

    const editionsArray = Array.from(Array(edition_).keys());

    for await (const index of editionsArray) {
      const edition = this.editionsService.createEdition({
        owner: { id: user.id },
      });
      productObject.editions.push(edition);
    }

    const history = this.productHistoriesService.create({
      amount: edition_,
      type: ProductHistoryType.create,
      operator: { id: user.id },
    });
    productObject.histories.push(history);

    const product = await this._insert(productObject);
    return product;
  }

  /*********************************************************************************
   ************************************ PRIVATE ************************************
   *********************************************************************************/
  /**
   * @description create Product bject
   * @param product
   * @returns Product
   */
  private _create(product_: Product): Product {
    return this.productRepository.create(product_);
  }

  /**
   * @description insert Product into DB
   * @param product
   * @returns Product
   */
  private async _insert(product_: Product): Promise<Product> {
    return this.productRepository.save(product_);
  }
}
