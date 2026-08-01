import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from '../telemetry/app-logger';
import {
  DEFAULT_REMINDER_TIME,
  UserSettingEntity,
} from './user-setting.entity';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

export interface UserSettingsResponse {
  reminderTime: string;
}

@Injectable()
export class UserSettingsService {
  private readonly logger = new AppLogger(UserSettingsService.name);

  constructor(
    @InjectRepository(UserSettingEntity)
    private readonly userSettingRepo: Repository<UserSettingEntity>,
  ) {}

  async get(userId: string): Promise<UserSettingsResponse> {
    const existing = await this.userSettingRepo.findOne({
      where: { userId },
    });
    return { reminderTime: existing?.reminderTime ?? DEFAULT_REMINDER_TIME };
  }

  async upsert(
    userId: string,
    dto: UpdateUserSettingsDto,
  ): Promise<UserSettingsResponse> {
    const existing = await this.userSettingRepo.findOne({
      where: { userId },
    });
    if (existing) {
      existing.reminderTime = dto.reminderTime;
      await this.userSettingRepo.save(existing);
    } else {
      const created = this.userSettingRepo.create({
        userId,
        reminderTime: dto.reminderTime,
      });
      await this.userSettingRepo.save(created);
    }
    this.logger.info('User settings updated', { 'user.id': userId });
    return { reminderTime: dto.reminderTime };
  }
}
