// editions/editions.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edition } from './edition.entity';
import { EditionsService } from './editions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Edition])],
  providers: [EditionsService],
  exports: [EditionsService],
})
export class EditionsModule {}
