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
import { AbiItem } from 'src/web3/interfaces/abi.interfaces';
import { Web3Service } from 'src/web3/web3.service';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Product } from './product.entity';
import productABI from '../web3/abis/product.abi.json';

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
    private readonly web3Service: Web3Service,
  ) {}

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  async getProducts(
    where_?: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    order_?: FindOptionsOrder<Product>,
    select_?: FindOptionsSelect<Product>,
  ): Promise<Product[]> {
    return this._selectMany(where_, relations_, order_, select_);
  }

  async getProduct(
    where_: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    select_?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    return this._selectOne(where_, relations_, select_);
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
      `${user.username}/${user.collections[0].symbol}/metadata`,
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

  /******************************************************************************
   ************************************ UPDATE **********************************
   ******************************************************************************/
  /**
   * @description sync Product
   * @param productId
   * @param tokenId
   * @param transactionHash
   * @returns Product
   */
  public async syncProduct(
    productId_: string,
    tokenId_: string,
    txnHash_: string,
  ): Promise<Product> {
    try {
      const product = await this._selectOne(
        { id: productId_ },
        {
          histories: true,
        },
      );
      if (!product.token_id) {
        product.token_id = tokenId_;
      }
      const productHistory = await this.productHistoriesService.create({
        type: ProductHistoryType.sync,
        txn_hash: txnHash_,
        product: { id: product.id },
        operator: { id: product.creator.id },
      });
      product.histories.push(productHistory);
      return this._insert(product);
    } catch (error_: any) {
      console.log('[collections.service.ts / syncCollection] => ', error_);
      return null;
    }
  }

  /******************************************************************************
   ************************************ CHECK ***********************************
   ******************************************************************************/

  /**
   * @description check Products sync
   * @param user
   * @param collectionId
   */
  public async checkProductsSync(collectionId_: string): Promise<void> {
    const nonsyncProducts = await this._selectMany(
      {
        collection: { id: collectionId_ },
        token_id: IsNull(),
      },
      { collection: true },
    );

    if (nonsyncProducts) {
      for await (const nonsyncProduct of nonsyncProducts) {
        const contractInstance = await this.web3Service.getContractInstance(
          productABI as AbiItem[],
          nonsyncProduct.collection.address,
        );
        try {
          const events = await contractInstance
            .getPastEvents('mintEvent', {
              topics: [
                ,
                this.web3Service.sha3(nonsyncProduct.id),
                this.web3Service.get64LengthAddress(
                  nonsyncProduct.creator.address,
                ),
              ],
              fromBlock: 0,
              toBlock: 'latest',
            })
            .then((events_: any) => events_)
            .catch(() => null);
          if (events.length > 0) {
            const event = events[0];
            const tokenId = event.returnValues.tokenId;
            const transactionHash = event.transactionHash;
            await this.syncProduct(nonsyncProduct.id, tokenId, transactionHash);
          } else {
            await this._delete({ id: nonsyncProduct.id });
          }
        } catch (error_: any) {
          console.log('[getPastEvents error_] => ', error_);
        }
      }
    }
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

  private async _selectMany(
    where_?: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    order_?: FindOptionsOrder<Product>,
    selelt_?: FindOptionsSelect<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find({
      where: where_,
      relations: relations_,
      order: order_,
      select: selelt_,
    });
  }

  private async _selectOne(
    where_: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    select_?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    return this.productRepository.findOne({
      where: where_,
      relations: relations_,
      select: select_,
    });
  }

  /**
   * @description delete Product
   * @param product
   */
  private async _delete(where_: FindOptionsWhere<Product>): Promise<void> {
    await this.productRepository.delete(where_);
  }
}
