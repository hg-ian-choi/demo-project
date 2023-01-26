import { Collection } from 'src/collections/collection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionHistoryType } from './enum/collection-history.enum';
import { CollectionStatus } from './enum/collection-status.enum';

@Entity('CollectionHistories')
export class CollectionHistory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  symbol: string;

  @Column('numeric')
  type: CollectionHistoryType;

  @Column('numeric', { default: CollectionStatus.nonsync })
  status?: CollectionStatus;

  @ManyToOne(() => Collection)
  collection?: Collection;

  @ManyToOne(() => User)
  operator?: User;
}
