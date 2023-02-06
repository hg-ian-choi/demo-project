// histories/histories.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ProductHistoryType } from './enum/product-history.enum';
import { ProductHistory } from './product-history.entity';

@Injectable()
export class ProductHistoriesService {
  constructor(
    @InjectRepository(ProductHistory)
    private readonly productHistory: Repository<ProductHistory>,
  ) {}

  /********************************************************************************
   ************************************ CREATE ************************************
   ********************************************************************************/
  public create(productHistory_: ProductHistory): ProductHistory {
    return this._create(productHistory_);
  }

  /******************************************************************************
   ************************************ READ ************************************
   ******************************************************************************/
  /********************************************************************************
   ************************************ UPDATE ************************************
   ********************************************************************************/

  /*********************************************************************************
   ************************************ PRIVATE ************************************
   *********************************************************************************/

  /**
   * @description create a ProductHistory Object (not insert)
   * @param productHistory
   * @returns ProductHistory
   */
  private _create(productHistory_: ProductHistory): ProductHistory {
    return this.productHistory.create(productHistory_);
  }

  /**
   * @description insert a ProductHistory Object into DB
   * @param productHistory
   * @returns ProductHistory
   */

  private async _save(
    productHistory_: ProductHistory,
  ): Promise<ProductHistory> {
    return this.productHistory.save(productHistory_);
  }
}
