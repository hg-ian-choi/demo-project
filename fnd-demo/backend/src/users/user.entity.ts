// users/user.entity.ts

import { Collection } from 'src/collections/collection.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', unique: true })
  email?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'varchar', unique: true })
  username?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  address?: string;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections?: Collection[];
}
