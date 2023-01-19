// users/user.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ type: 'varchar', unique: true })
  public email?: string;

  @Column({ type: 'varchar' })
  public password?: string;

  @Column({ type: 'varchar', unique: true })
  public username?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  public address?: string;

  // @OneToMany(() => Collection, (collection) => collection.user)
  // public collections?: Collection[];

  // @OneToMany(() => Product, (product) => product.creator)
  // public products: Product[];

  // @OneToMany(() => Edition, (edition) => edition.owner)
  // public editions: Edition[];

  // @OneToMany(() => History, (history) => history.buyer)
  // histories: History[];
}
