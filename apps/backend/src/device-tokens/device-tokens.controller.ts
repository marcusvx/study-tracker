import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DeviceTokensService } from './device-tokens.service';
import { UpsertDeviceTokenDto } from './dto/upsert-device-token.dto';
import { DeleteDeviceTokenDto } from './dto/delete-device-token.dto';
import { DeviceTokenEntity } from './device-token.entity';

@Controller('device-tokens')
@UseGuards(SupabaseAuthGuard)
export class DeviceTokensController {
  constructor(private readonly deviceTokensService: DeviceTokensService) {}

  @Post()
  upsert(
    @Body() dto: UpsertDeviceTokenDto,
    @CurrentUser() userId: string,
  ): Promise<DeviceTokenEntity> {
    return this.deviceTokensService.upsert(userId, dto);
  }

  @Delete()
  async remove(
    @Body() dto: DeleteDeviceTokenDto,
    @CurrentUser() userId: string,
  ): Promise<{ deleted: true }> {
    await this.deviceTokensService.remove(userId, dto.token);
    return { deleted: true };
  }
}
