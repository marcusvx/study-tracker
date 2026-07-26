import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyItemEntity } from './study-item.entity';

@Injectable()
export class StudyItemsService {
  constructor(
    @InjectRepository(StudyItemEntity)
    private readonly studyItemRepo: Repository<StudyItemEntity>,
  ) {}

  async findAll(): Promise<StudyItemEntity[]> {
    return this.studyItemRepo.find({ relations: { log: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<StudyItemEntity> {
    const item = await this.studyItemRepo.findOne({ where: { id }, relations: { log: true } });
    if (!item) throw new NotFoundException(`Study item ${id} not found`);
    return item;
  }

  async create(data: Partial<StudyItemEntity>): Promise<StudyItemEntity> {
    const item = this.studyItemRepo.create(data);
    return this.studyItemRepo.save(item);
  }

  async update(id: string, data: Partial<StudyItemEntity>): Promise<StudyItemEntity> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.studyItemRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.studyItemRepo.remove(item);
  }
}
