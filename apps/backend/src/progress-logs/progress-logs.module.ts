import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressLogEntity } from './progress-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressLogEntity])],
  exports: [TypeOrmModule],
})
export class ProgressLogsModule {}
