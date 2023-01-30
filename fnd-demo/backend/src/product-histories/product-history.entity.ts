// histories/history.entity.ts

import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductHistoryType } from './enum/product-history.enum';

@Entity('product_histories')
export class ProductHistory {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('numeric', { default: 0 })
  public price?: number;

  @Column('numeric', { default: 1 })
  public amount?: number;

  @Column('numeric')
  public type: ProductHistoryType;

  @ManyToOne(() => User)
  public seller: User;

  @ManyToOne(() => User)
  public buyer: User;

  @ManyToOne(() => Product)
  public product: Product;
}
