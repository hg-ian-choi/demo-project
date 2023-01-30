import { Collection } from 'src/collections/collection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionHistoryType } from './enum/collection-history.enum';

@Entity('collection_histories')
export class CollectionHistory {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('numeric')
  public type: CollectionHistoryType;

  @Column('varchar', { nullable: true })
  public transactionHash?: string;

  @ManyToOne(() => Collection)
  public collection: Collection;
}
