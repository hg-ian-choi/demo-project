// interfaces/edition.interface.ts

import { Status } from '../enums/status.enum';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Edition {
  id: string;
  price: number | 0;
  status: number | Status.Soldout;
  owner: User;
  product: Product;
}
