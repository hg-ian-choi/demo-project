// collections/collection.entity.ts

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
  id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  address: string;

  @ManyToOne(() => User, { cascade: true })
  user: User;

  @OneToMany(() => Product, (product) => product.collection)
  products: Product[];
}
