import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from '../telemetry/app-logger';
import { StudyItemEntity } from './study-item.entity';
import { ProgressLogEntity } from '../progress-logs/progress-log.entity';
import { CreateStudyItemDto } from './dto/create-study-item.dto';
import { UpdateStudyItemDto } from './dto/update-study-item.dto';
import { CreateProgressLogDto } from '../progress-logs/dto/create-progress-log.dto';

@Injectable()
export class StudyItemsService {
  private readonly logger = new AppLogger(StudyItemsService.name);

  constructor(
    @InjectRepository(StudyItemEntity)
    private readonly studyItemRepo: Repository<StudyItemEntity>,
    @InjectRepository(ProgressLogEntity)
    private readonly progressLogRepo: Repository<ProgressLogEntity>,
  ) {}

  async findAll(userId: string): Promise<StudyItemEntity[]> {
    return this.studyItemRepo.find({
      where: { userId },
      relations: { log: true },
      order: {
        createdAt: 'DESC',
        log: { createdAt: 'ASC' },
      },
    });
  }

  async findOne(id: string, userId: string): Promise<StudyItemEntity> {
    const item = await this.studyItemRepo.findOne({
      where: { id, userId },
      relations: { log: true },
      order: { log: { createdAt: 'ASC' } },
    });
    if (!item) throw new NotFoundException(`Study item ${id} not found`);
    return item;
  }

  async create(
    data: CreateStudyItemDto,
    userId: string,
  ): Promise<StudyItemEntity> {
    this.logger.info('Creating study item', {
      'user.id': userId,
      'study_item.category': data.category,
      'study_item.unit': data.unit,
      'study_item.total_scope': data.totalScope,
      'study_item.current_progress': data.currentProgress,
      'study_item.status': data.status,
    });

    const item = this.studyItemRepo.create({
      ...data,
      userId,
      currentProgress: data.currentProgress ?? 0,
      status: data.status ?? 'active',
      log: [],
    });

    try {
      const saved = await this.studyItemRepo.save(item);
      this.logger.info('Study item created', {
        'user.id': userId,
        'study_item.id': saved.id,
      });
      return saved;
    } catch (err) {
      this.logger.error('Failed to create study item', {
        'user.id': userId,
        'error.message': err instanceof Error ? err.message : String(err),
        'error.name': err instanceof Error ? err.name : undefined,
        'error.stack': err instanceof Error ? err.stack : undefined,
      });
      throw err;
    }
  }

  async update(
    id: string,
    data: UpdateStudyItemDto,
    userId: string,
  ): Promise<StudyItemEntity> {
    const item = await this.findOne(id, userId);
    Object.assign(item, data);
    return this.studyItemRepo.save(item);
  }

  async remove(id: string, userId: string): Promise<void> {
    const item = await this.findOne(id, userId);
    await this.studyItemRepo.remove(item);
  }

  async addProgressLog(
    id: string,
    dto: CreateProgressLogDto,
    userId: string,
  ): Promise<StudyItemEntity> {
    const item = await this.findOne(id, userId);

    const today = new Date().toISOString().slice(0, 10);
    const newLog = this.progressLogRepo.create({
      date: dto.date || today,
      amount: dto.amount,
      minutes: dto.minutes,
      note: dto.note || undefined,
      studyItem: item,
    });

    await this.progressLogRepo.save(newLog);

    const newProgress = Math.min(
      item.totalScope,
      item.currentProgress + dto.amount,
    );
    item.currentProgress = newProgress;
    if (newProgress >= item.totalScope) {
      item.status = 'done';
    }

    await this.studyItemRepo.save(item);
    return this.findOne(id, userId);
  }

  async togglePause(id: string, userId: string): Promise<StudyItemEntity> {
    const item = await this.findOne(id, userId);
    item.status = item.status === 'paused' ? 'active' : 'paused';
    return this.studyItemRepo.save(item);
  }
}
