import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from '../telemetry/app-logger';
import { DeviceTokenEntity } from './device-token.entity';
import { UpsertDeviceTokenDto } from './dto/upsert-device-token.dto';

@Injectable()
export class DeviceTokensService {
  private readonly logger = new AppLogger(DeviceTokensService.name);

  constructor(
    @InjectRepository(DeviceTokenEntity)
    private readonly deviceTokenRepo: Repository<DeviceTokenEntity>,
  ) {}

  async upsert(
    userId: string,
    dto: UpsertDeviceTokenDto,
  ): Promise<DeviceTokenEntity> {
    const existing = await this.deviceTokenRepo.findOne({
      where: { token: dto.token },
    });

    if (existing) {
      existing.userId = userId;
      existing.platform = dto.platform;
      const saved = await this.deviceTokenRepo.save(existing);
      // Never log the raw device token.
      this.logger.info('Device token updated', {
        'user.id': userId,
        'device.platform': dto.platform,
        'device_token.action': 'update',
      });
      return saved;
    }

    const created = this.deviceTokenRepo.create({
      userId,
      token: dto.token,
      platform: dto.platform,
    });
    const saved = await this.deviceTokenRepo.save(created);
    this.logger.info('Device token registered', {
      'user.id': userId,
      'device.platform': dto.platform,
      'device_token.action': 'create',
    });
    return saved;
  }

  async remove(userId: string, token: string): Promise<void> {
    await this.deviceTokenRepo.delete({ userId, token });
    this.logger.info('Device token removed', {
      'user.id': userId,
      'device_token.action': 'delete',
    });
  }

  async findByUserIds(userIds: string[]): Promise<DeviceTokenEntity[]> {
    if (userIds.length === 0) return [];
    return this.deviceTokenRepo
      .createQueryBuilder('dt')
      .where('dt.userId IN (:...userIds)', { userIds })
      .getMany();
  }
}
