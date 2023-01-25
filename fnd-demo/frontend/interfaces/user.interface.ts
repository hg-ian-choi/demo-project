// interfaces/user.interface.ts

import { Collection } from './collection.interface';
import { Product } from './product.interface';

export interface User {
  id: string;
  email: string;
  username: string;
  address: string;
  collections?: Collection[];
  products?: Product[];
}
