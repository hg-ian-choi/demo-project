// histories/history.entity.ts

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductHistoryType } from '../enum/product-history.enum';
import { ProductHistory } from '../product-history.entity';

export class CreateProductHistoryDto extends ProductHistory {
  @IsNumber()
  @IsOptional()
  public price?: number;

  @IsNumber()
  @IsOptional()
  public amount?: number;

  @IsNumber()
  public type: ProductHistoryType;

  @IsString()
  @IsOptional()
  public txn_hash?: string;
}
