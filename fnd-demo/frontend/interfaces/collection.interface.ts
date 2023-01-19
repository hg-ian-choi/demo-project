// interfaces/collection.interface.ts

import { product } from './product.interface';
import { user } from './user.interface';

export interface collection {
  id: string;
  name: string;
  symbol: string;
  user?: user;
  products?: product[];
}
