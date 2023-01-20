// products/product.entity.ts

import { Collection } from 'src/collections/collection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, { cascade: true })
  public creator: User;

  @ManyToOne(() => Collection, { cascade: true })
  public collection: Collection;

  // @OneToMany(() => Edition, (edition) => edition.product)
  // public editions: Edition[];

  // @OneToMany(() => History, (history) => history.product)
  // histories: History[];
}
