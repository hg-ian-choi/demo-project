import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ewallets')
export class Ewallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  wallet_address: string;

  @Column('numeric')
  valid_time: number;
}
