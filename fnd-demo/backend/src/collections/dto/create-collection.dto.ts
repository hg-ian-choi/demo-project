import { IsString } from 'class-validator';
import { Collection } from '../collection.entity';

export class CreateCollectionDto extends Collection {
  @IsString()
  public name: string;

  @IsString()
  public symbol: string;
}
