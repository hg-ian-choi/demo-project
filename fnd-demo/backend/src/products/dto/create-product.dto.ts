import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Collection } from 'src/collections/collection.entity';
import { Edition } from 'src/editions/edition.entity';
import { User } from 'src/users/user.entity';
import { Product } from '../product.entity';

export class CreateProductDto extends Product {
  @IsString()
  public name: string;

  @IsString()
  public description?: string;

  @IsString()
  public image?: string;

  @IsString()
  @IsOptional()
  public token_id?: string;

  @IsNumber()
  public editions?: Edition[];

  @IsString()
  @IsOptional()
  public creator: User;

  @IsString()
  @IsOptional()
  public collection: Collection;
}
