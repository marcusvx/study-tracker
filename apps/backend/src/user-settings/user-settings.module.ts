import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserSettingEntity } from './user-setting.entity';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserSettingEntity])],
  providers: [UserSettingsService],
  controllers: [UserSettingsController],
})
export class UserSettingsModule {}
