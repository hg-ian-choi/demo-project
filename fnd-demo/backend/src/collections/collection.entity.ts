// collections/collection.entity.ts

import { CollectionHistory } from 'src/collection-histories/collection-histories.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar')
  public name?: string;

  @Column('varchar')
  public symbol?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  public address?: string;

  @ManyToOne(() => User, (user) => user.collections)
  public owner?: User;

  @OneToMany(() => Product, (product) => product.collection, { cascade: true })
  public products?: Product[];

  @OneToMany(
    () => CollectionHistory,
    (collectionHistory) => collectionHistory.collection,
  )
  public histories?: CollectionHistory[];
}
