import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionHistory } from './collection-histories.entity';
import { CollectionHistoriesService } from './collection-histories.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionHistory])],
  providers: [CollectionHistoriesService],
  exports: [CollectionHistoriesService],
})
export class CollectionHistoriesModule {}
