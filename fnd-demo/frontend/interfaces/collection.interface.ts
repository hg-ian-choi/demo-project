// interfaces/collection.interface.ts

import { nft } from './nft.interface';
import { user } from './user.interface';

export interface collection {
  id: string;
  name: string;
  symbol: string;
  user?: user;
  nfts?: nft[];
}
