// editions/edition.entity.ts

import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from './enum/status.enum';

@Entity('editions')
export class Edition {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('numeric', { default: 0 })
  public price?: number;

  @Column('numeric', { default: Status.Soldout })
  public status?: number;

  @ManyToOne(() => User)
  public owner?: User;

  @ManyToOne(() => Product, (product) => product.editions, {
    onUpdate: 'CASCADE',
  })
  public product?: Product;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at?: Date;
}
