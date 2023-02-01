import { CollectionHistoryType } from '../enums/collection-history-type.enum';
import { Collection } from './collection.interface';

export interface CollectionHistory {
  id: string;
  type: CollectionHistoryType;
  transactionHash?: string;
  created_at: string;
  collection: Collection;
}
