import { IsNumber } from 'class-validator';
import { Edition } from '../edition.entity';

export class CreateEditionDto extends Edition {
  public price?: number;

  @IsNumber()
  public status?: number;
}
