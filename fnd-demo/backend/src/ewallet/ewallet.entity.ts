import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ewallets')
export class Ewallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  wallet_address: string;

  @Column('numeric')
  valid_time: number;

  @ManyToOne(() => User, (user) => user.ewallets)
  user: User;
}
