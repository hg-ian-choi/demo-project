// collections/collection.entity.ts

import { NFT } from 'src/nfts/nft.entity';
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

  @OneToMany(() => NFT, (nft) => nft.collection)
  nfts: NFT[];
}
