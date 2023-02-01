// users/user.entity.ts

import { Collection } from 'src/collections/collection.entity';
import { Product } from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ type: 'varchar', unique: true })
  public email?: string;

  @Column({ type: 'varchar', select: false })
  public password?: string;

  @Column({ type: 'varchar', unique: true })
  public username?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  public address?: string;

  @OneToMany(() => Collection, (collection) => collection.owner, {
    cascade: true,
  })
  public collections?: Collection[];

  @OneToMany(() => Product, (product) => product.creator, { cascade: true })
  public created?: Product[];
}
