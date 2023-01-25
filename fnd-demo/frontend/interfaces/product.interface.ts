// interfaces/product.interface.ts

import { Edition } from './edition.interface';
import { History } from './history.interface';
import { User } from './user.interface';

export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  token_address: string;
  token_id: string;
  creator?: User;
  editions: Edition[];
  histories?: History[];
}
