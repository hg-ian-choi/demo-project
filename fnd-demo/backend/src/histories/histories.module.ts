// histories/histories.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriesService } from './histories.service';
import { History } from './history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  providers: [HistoriesService],
  exports: [HistoriesService],
})
export class HistoriesModule {}
