// interfaces/user.interface.ts

import { collection } from './collection.interface';
import { nft } from './nft.interface';

export interface user {
  id: string;
  email: string;
  username: string;
  address: string;
  collections?: collection[];
  nfts?: nft[];
}
