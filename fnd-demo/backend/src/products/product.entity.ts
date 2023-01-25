// products/product.entity.ts

import { Collection } from 'src/collections/collection.entity';
import { Edition } from 'src/editions/edition.entity';
import { History } from 'src/histories/history.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('varchar')
  public name?: string;

  @Column('varchar')
  public description?: string;

  @Column('varchar')
  public image?: string;

  @Column('varchar', { nullable: true })
  public token_id?: string;

  @Column('boolean', { default: false })
  public show?: boolean;

  @ManyToOne(() => User)
  public creator: User;

  @ManyToOne(() => Collection)
  public collection: Collection;

  @OneToMany(() => Edition, (edition) => edition.product, { cascade: true })
  public editions?: Edition[];

  @OneToMany(() => History, (history) => history.product, { cascade: true })
  histories?: History[];
}
