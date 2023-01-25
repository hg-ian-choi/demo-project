// interfaces/collection.interface.ts

import { Product } from './product.interface';
import { User } from './user.interface';

export interface Collection {
  id: string;
  name: string;
  symbol: string;
  address: string;
  user?: User;
  products: Product[];
}
