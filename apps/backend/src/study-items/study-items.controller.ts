import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StudyItemsService } from './study-items.service';
import { StudyItemEntity } from './study-item.entity';

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
  create(@Body() data: Partial<StudyItemEntity>): Promise<StudyItemEntity> {
    return this.studyItemsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<StudyItemEntity>): Promise<StudyItemEntity> {
    return this.studyItemsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.studyItemsService.remove(id);
  }
}
