// nfts/nft.entity.ts

import { Collection } from 'src/collections/collection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nfts')
export class NFT {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar')
  public title: string;

  @Column('varchar')
  public description?: string;

  @Column('varchar')
  public image: string;

  @Column('varchar')
  public token_address: string;

  @Column('varchar')
  public token_id: string;

  @ManyToOne(() => User, { cascade: true })
  public creator: User;

  @ManyToOne(() => Collection, { cascade: true })
  public collection: Collection;

  // @OneToMany(() => Edition, (edition) => edition.nft)
  // public editions: Edition[];

  // @OneToMany(() => History, (history) => history.nft)
  // histories: History[];
}
