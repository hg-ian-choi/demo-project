import { IsString } from 'class-validator';
import { CreateCollectionHistoryDto } from './create-collection-history.dto';

export class UpdateCollectionHistoryDto extends CreateCollectionHistoryDto {
  @IsString()
  public address: string;
}
