import { IsString } from 'class-validator';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Edition } from '../edition.entity';

export class CreateEditionDto extends Edition {
  @IsString()
  public owner: User;

  @IsString()
  public product: Product;
}
