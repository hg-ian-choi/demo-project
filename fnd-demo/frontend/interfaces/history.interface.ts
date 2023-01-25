// interfaces/history.interface.ts

import { HistoryType } from '../enums/history-type.enum';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface History {
  id: string;
  price?: number | 0;
  amount?: number | 1;
  type: HistoryType;
  seller: User;
  buyer: User;
  product: Product;
}
