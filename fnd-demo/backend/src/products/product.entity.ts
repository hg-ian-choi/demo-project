// products/product.entity.ts

import { Collection } from 'src/collections/collection.entity';
import { Edition } from 'src/editions/edition.entity';
import { ProductHistory } from 'src/product-histories/product-history.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
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

  @Column('varchar', { nullable: true })
  public description?: string;

  @Column('varchar', { nullable: true })
  public metadata?: string;

  @Column('varchar', { nullable: true })
  public image?: string;

  @Column('varchar', { nullable: true })
  public token_id?: string;

  @ManyToOne(() => User)
  public creator?: User;

  @ManyToOne(() => Collection)
  public collection?: Collection;

  @OneToMany(() => Edition, (edition) => edition.product, {
    cascade: true,
  })
  public editions?: Edition[];

  @OneToMany(() => ProductHistory, (history) => history.product, {
    cascade: true,
  })
  public histories?: ProductHistory[];

  @CreateDateColumn({ type: 'timestamp' })
  public created_at?: Date;
}
