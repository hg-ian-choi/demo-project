import { IsNumber, IsString } from 'class-validator';
import { CollectionHistory } from '../collection-histories.entity';

export class CreateCollectionHistoryDto extends CollectionHistory {
  @IsString()
  name: string;

  @IsString()
  symbol: string;
}
