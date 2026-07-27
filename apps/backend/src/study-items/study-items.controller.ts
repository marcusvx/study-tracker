import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StudyItemsService } from './study-items.service';
import { StudyItemEntity } from './study-item.entity';
import { CreateStudyItemDto } from './dto/create-study-item.dto';
import { UpdateStudyItemDto } from './dto/update-study-item.dto';
import { CreateProgressLogDto } from '../progress-logs/dto/create-progress-log.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('study-items')
@UseGuards(SupabaseAuthGuard)
export class StudyItemsController {
  constructor(private readonly studyItemsService: StudyItemsService) {}

  @Get()
  findAll(@CurrentUser() userId: string): Promise<StudyItemEntity[]> {
    return this.studyItemsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.findOne(id, userId);
  }

  @Post()
  create(
    @Body() dto: CreateStudyItemDto,
    @CurrentUser() userId: string,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.create(dto, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStudyItemDto,
    @CurrentUser() userId: string,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.update(id, dto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.studyItemsService.remove(id, userId);
  }

  @Post(':id/logs')
  addProgressLog(
    @Param('id') id: string,
    @Body() dto: CreateProgressLogDto,
    @CurrentUser() userId: string,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.addProgressLog(id, dto, userId);
  }

  @Patch(':id/toggle-pause')
  togglePause(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<StudyItemEntity> {
    return this.studyItemsService.togglePause(id, userId);
  }
}
