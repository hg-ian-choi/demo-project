// nfts/nfts.module.ts

import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { NFT } from './nft.entity';

@Module({
  imports: [NFT],
  providers: [NftsService],
  controllers: [NftsController],
})
export class NftsModule {}
