import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  UserSettingsService,
  UserSettingsResponse,
} from './user-settings.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Controller('user-settings')
@UseGuards(SupabaseAuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  get(@CurrentUser() userId: string): Promise<UserSettingsResponse> {
    return this.userSettingsService.get(userId);
  }

  @Put()
  update(
    @Body() dto: UpdateUserSettingsDto,
    @CurrentUser() userId: string,
  ): Promise<UserSettingsResponse> {
    return this.userSettingsService.upsert(userId, dto);
  }
}
