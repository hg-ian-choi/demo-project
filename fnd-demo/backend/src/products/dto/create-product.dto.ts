import { IsOptional, IsString } from 'class-validator';
import { Product } from '../product.entity';

export class CreateProductDto extends Product {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;
}
