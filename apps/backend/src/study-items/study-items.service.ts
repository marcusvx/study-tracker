import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyItemEntity } from './study-item.entity';
import { ProgressLogEntity } from '../progress-logs/progress-log.entity';
import { CreateStudyItemDto } from './dto/create-study-item.dto';
import { UpdateStudyItemDto } from './dto/update-study-item.dto';
import { CreateProgressLogDto } from '../progress-logs/dto/create-progress-log.dto';

@Injectable()
export class StudyItemsService {
  constructor(
    @InjectRepository(StudyItemEntity)
    private readonly studyItemRepo: Repository<StudyItemEntity>,
    @InjectRepository(ProgressLogEntity)
    private readonly progressLogRepo: Repository<ProgressLogEntity>,
  ) {}

  async findAll(): Promise<StudyItemEntity[]> {
    return this.studyItemRepo.find({
      relations: { log: true },
      order: {
        createdAt: 'DESC',
        log: { createdAt: 'ASC' },
      },
    });
  }

  async findOne(id: string): Promise<StudyItemEntity> {
    const item = await this.studyItemRepo.findOne({
      where: { id },
      relations: { log: true },
      order: { log: { createdAt: 'ASC' } },
    });
    if (!item) throw new NotFoundException(`Study item ${id} not found`);
    return item;
  }

  async create(data: CreateStudyItemDto): Promise<StudyItemEntity> {
    const item = this.studyItemRepo.create({
      ...data,
      currentProgress: data.currentProgress ?? 0,
      status: data.status ?? 'active',
      log: [],
    });
    return this.studyItemRepo.save(item);
  }

  async update(id: string, data: UpdateStudyItemDto): Promise<StudyItemEntity> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.studyItemRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.studyItemRepo.remove(item);
  }

  async addProgressLog(
    id: string,
    dto: CreateProgressLogDto,
  ): Promise<StudyItemEntity> {
    const item = await this.findOne(id);

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
    return this.findOne(id);
  }

  async togglePause(id: string): Promise<StudyItemEntity> {
    const item = await this.findOne(id);
    item.status = item.status === 'paused' ? 'active' : 'paused';
    return this.studyItemRepo.save(item);
  }
}
