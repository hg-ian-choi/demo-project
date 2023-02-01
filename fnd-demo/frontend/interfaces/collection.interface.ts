// interfaces/collection.interface.ts

import { CollectionHistory } from './collection-histories.interface';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Collection {
  id: string;
  name: string;
  symbol: string;
  address?: string;
  created_at: string;
  user: User;
  products?: Product[];
  histories?: CollectionHistory[];
}
