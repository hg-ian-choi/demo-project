// user/user.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  wallet_address?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  wallet_private_key?: string;
}
