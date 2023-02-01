import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from '../product.entity';

export class CreateProductDto extends Product {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public metadata?: string;

  @IsString()
  @IsOptional()
  public image?: string;

  @IsNumber()
  @IsOptional()
  public token_id?: string;
}
