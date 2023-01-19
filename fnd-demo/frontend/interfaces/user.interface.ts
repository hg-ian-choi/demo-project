// interfaces/user.interface.ts

import { collection } from './collection.interface';
import { product } from './product.interface';

export interface user {
  id: string;
  email: string;
  username: string;
  address: string;
  collections?: collection[];
  products?: product[];
}
