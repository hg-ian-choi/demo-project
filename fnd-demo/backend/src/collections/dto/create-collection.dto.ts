import { IsString } from 'class-validator';
import { Collection } from '../collection.entity';

export class CreateCollectionDto extends Collection {
  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsString()
  address: string;
}
