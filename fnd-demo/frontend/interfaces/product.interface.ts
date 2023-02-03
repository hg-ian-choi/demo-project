// interfaces/product.interface.ts

import { Collection } from './collection.interface';
import { Edition } from './edition.interface';
import { ProductHistory } from './product-history.interface';
import { User } from './user.interface';

export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  metadata?: string;
  token_id?: string;
  total_edition: number;
  created_at: string;
  creator: User;
  editions: Edition[];
  histories?: ProductHistory[];
  collection?: Collection;
}
