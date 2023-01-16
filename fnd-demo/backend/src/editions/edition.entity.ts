// editions/edition.entity.ts

import { NFT } from 'src/nfts/nft.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './editions.enum';

@Entity('editions')
export class Edition {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('numeric', { default: 0 })
  public price: number;

  @Column('numeric', { default: Status.Soldout })
  public status: number;

  @ManyToOne(() => User, { cascade: true })
  public owner: User;

  @ManyToOne(() => NFT, { cascade: true })
  public nft: NFT;
}
