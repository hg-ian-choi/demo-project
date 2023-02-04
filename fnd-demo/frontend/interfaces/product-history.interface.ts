// interfaces/history.interface.ts

import { ProductHistoryType } from '../enums/product-history-type.enum';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface ProductHistory {
  id: string;
  price?: number | 0;
  amount?: number | 1;
  type: ProductHistoryType;
  created_at: string;
  seller: User;
  buyer: User;
  operator: User;
  product: Product;
}
