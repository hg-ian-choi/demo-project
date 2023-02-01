import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CollectionHistory } from '../collection-histories.entity';
import { CollectionHistoryType } from '../enum/collection-history.enum';

export class CreateCollectionHistoryDto extends CollectionHistory {
  @IsNumber()
  public type: CollectionHistoryType;

  @IsString()
  @IsOptional()
  public txn_hash?: string;
}
