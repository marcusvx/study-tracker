import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyItemEntity } from './study-item.entity';
import { ProgressLogEntity } from '../progress-logs/progress-log.entity';
import { StudyItemsService } from './study-items.service';
import { StudyItemsController } from './study-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudyItemEntity, ProgressLogEntity])],
  providers: [StudyItemsService],
  controllers: [StudyItemsController],
  exports: [StudyItemsService],
})
export class StudyItemsModule {}
