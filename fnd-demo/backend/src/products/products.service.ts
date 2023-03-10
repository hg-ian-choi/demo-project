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
import { Edition } from 'src/editions/edition.entity';

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
  /**
   * @description get Product List
   * @param where
   * @param relations
   * @param order
   * @param select
   * @returns Product[]
   */
  public async getProducts(
    where_?: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    order_?: FindOptionsOrder<Product>,
    select_?: FindOptionsSelect<Product>,
  ): Promise<Product[]> {
    return this._selectMany(where_, relations_, order_, select_);
  }

  public async getProduct(
    where_: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    select_?: FindOptionsSelect<Product>,
  ): Promise<Product> {
    return this._selectOne(where_, relations_, select_);
  }

  /**
   * @description get Product
   * @param where
   * @param relations
   * @param select
   * @returns Product
   */
  public async getPageProduct(
    where_: FindOptionsWhere<Product>,
    relations_?: FindOptionsRelations<Product>,
    select_?: FindOptionsSelect<Product>,
  ): Promise<any> {
    const product = await this._selectOne(where_, relations_, select_);

    const editions: { edition: Edition; count: number }[] = [];

    for await (const edition_ of product.editions) {
      const findedEditionIndex = editions.findIndex(
        (findEdition_: { edition: Edition; count: number }) =>
          findEdition_?.edition?.owner?.id === edition_.owner.id &&
          findEdition_?.edition?.status === edition_.status,
      );
      if (findedEditionIndex >= 0) {
        editions[findedEditionIndex].count += 1;
      } else {
        editions.push({ edition: edition_, count: 1 });
      }
    }

    console.log('_product', { ...product, editions: editions });

    return { ...product, editions: editions };
  }

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  /**
   * @visibility public
   * @description create Product Object
   * @param user
   * @param file
   * @param edition
   * @param collectionId
   * @param createProductDto
   * @returns Product
   */
  public async createProduct(
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
      description: createProductDto_.description,
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
    createProductDto_.total_edition = edition_;
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
    return this.getProduct({ id: product.id }, { collection: true });
  }

  /******************************************************************************
   ************************************ UPDATE **********************************
   ******************************************************************************/
  /**
   * @visibility public
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
          creator: true,
        },
      );
      if (!product.token_id) {
        product.token_id = tokenId_;
      }
      const productHistory = await this.productHistoriesService.create({
        type: ProductHistoryType.sync,
        amount: product.total_edition,
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
      { collection: true, creator: true },
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
            .catch(() => []);
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
   * @visibility private
   * @description create Product Object
   * @param product
   * @returns Product
   */
  private _create(product_: Product): Product {
    return this.productRepository.create(product_);
  }

  /**
   * @visibility private
   * @description insert Product
   * @param product
   * @returns Product
   */
  private async _insert(product_: Product): Promise<Product> {
    return this.productRepository.save(product_);
  }

  /**
   * @visibility private
   * @description select Product list
   * @param where
   * @param relations
   * @param order
   * @param selelt
   * @returns Product[]
   */
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

  /**
   * @visibility private
   * @description select Product
   * @param where
   * @param relations
   * @param select
   * @returns Product
   */
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
   * @visibility private
   * @description delete Product
   * @param product
   */
  private async _delete(where_: FindOptionsWhere<Product>): Promise<void> {
    await this.productRepository.delete(where_);
  }
}
