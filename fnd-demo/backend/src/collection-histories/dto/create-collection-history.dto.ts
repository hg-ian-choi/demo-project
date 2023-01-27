import { IsNumber, IsString } from 'class-validator';
import { CollectionHistory } from '../collection-histories.entity';

export class CreateCollectionHistoryDto extends CollectionHistory {
  @IsString()
  public name: string;

  @IsString()
  public symbol: string;
}
