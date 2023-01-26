// editions/edition.entity.ts

import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './enum/editions.enum';

@Entity('editions')
export class Edition {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('numeric', { default: 0 })
  public price?: number;

  @Column('numeric', { default: Status.Soldout })
  public status?: number;

  @ManyToOne(() => User)
  public owner: User;

  @ManyToOne(() => Product, (product) => product.editions)
  public product: Product;
}
