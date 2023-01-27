import { Collection } from 'src/collections/collection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionHistoryType } from './enum/collection-history.enum';

@Entity('CollectionHistories')
export class CollectionHistory {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('varchar')
  public name: string;

  @Column('varchar')
  public symbol: string;

  @Column('numeric')
  public type: CollectionHistoryType;

  @ManyToOne(() => Collection)
  public collection: Collection;

  @ManyToOne(() => User)
  public operator: User;
}
