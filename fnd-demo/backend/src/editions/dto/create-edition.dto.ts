import { IsNumber, IsOptional } from 'class-validator';
import { Edition } from '../edition.entity';

export class CreateEditionDto extends Edition {
  @IsNumber()
  @IsOptional()
  public price?: number;

  @IsNumber()
  @IsOptional()
  public status?: number;
}
