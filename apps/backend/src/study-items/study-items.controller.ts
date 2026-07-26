import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { StudyItemsService } from './study-items.service';
import { StudyItemEntity } from './study-item.entity';
import { CreateStudyItemDto } from './dto/create-study-item.dto';
import { UpdateStudyItemDto } from './dto/update-study-item.dto';
import { CreateProgressLogDto } from '../progress-logs/dto/create-progress-log.dto';

@Controller('study-items')
export class StudyItemsController {
  constructor(private readonly studyItemsService: StudyItemsService) {}

  @Get()
  findAll(): Promise<StudyItemEntity[]> {
    return this.studyItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StudyItemEntity> {
    return this.studyItemsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateStudyItemDto): Promise<StudyItemEntity> {
    return this.studyItemsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStudyItemDto,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.studyItemsService.remove(id);
  }

  @Post(':id/logs')
  addProgressLog(
    @Param('id') id: string,
    @Body() dto: CreateProgressLogDto,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.addProgressLog(id, dto);
  }

  @Patch(':id/toggle-pause')
  togglePause(@Param('id') id: string): Promise<StudyItemEntity> {
    return this.studyItemsService.togglePause(id);
  }
}
