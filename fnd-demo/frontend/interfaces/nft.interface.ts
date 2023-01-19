import { user } from './user.interface';

export interface nft {
  id: string;
  title: string;
  description?: string;
  image: string;
  token_address: string;
  token_id: string;
  creator?: user;
}
