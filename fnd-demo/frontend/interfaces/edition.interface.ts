// interfaces/edition.interface.ts

import { ProductStatus } from '../enums/product-status.enum';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Edition {
  id: string;
  price: number | 0;
  status: number | ProductStatus.Soldout;
  owner: User;
  product: Product;
  created_at: string;
}
