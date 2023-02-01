// histories/history.entity.ts

import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductHistoryType } from './enum/product-history.enum';

@Entity('product_histories')
export class ProductHistory {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('numeric', { default: 0 })
  public price?: number;

  @Column('numeric', { default: 1 })
  public amount?: number;

  @Column('numeric')
  public type?: ProductHistoryType;

  @Column('varchar', { nullable: true })
  public txn_hash?: string;

  @ManyToOne(() => Product, {
    onUpdate: 'CASCADE',
  })
  public product?: Product;

  @ManyToOne(() => User)
  public operator?: User;

  @ManyToOne(() => User, { nullable: true })
  public seller?: User;

  @ManyToOne(() => User, { nullable: true })
  public buyer?: User;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at?: Date;
}
