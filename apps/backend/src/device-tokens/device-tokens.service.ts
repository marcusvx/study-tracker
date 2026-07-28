import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTokenEntity } from './device-token.entity';
import { UpsertDeviceTokenDto } from './dto/upsert-device-token.dto';

@Injectable()
export class DeviceTokensService {
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
      return this.deviceTokenRepo.save(existing);
    }

    const created = this.deviceTokenRepo.create({
      userId,
      token: dto.token,
      platform: dto.platform,
    });
    return this.deviceTokenRepo.save(created);
  }

  async remove(userId: string, token: string): Promise<void> {
    await this.deviceTokenRepo.delete({ userId, token });
  }

  async findByUserIds(userIds: string[]): Promise<DeviceTokenEntity[]> {
    if (userIds.length === 0) return [];
    return this.deviceTokenRepo
      .createQueryBuilder('dt')
      .where('dt.userId IN (:...userIds)', { userIds })
      .getMany();
  }
}
