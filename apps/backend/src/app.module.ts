import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './database/typeorm.config';
import { HealthController } from './health/health.controller';
import { StudyItemsModule } from './study-items/study-items.module';
import { ProgressLogsModule } from './progress-logs/progress-logs.module';
import { DeviceTokensModule } from './device-tokens/device-tokens.module';
import { RemindersModule } from './reminders/reminders.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    StudyItemsModule,
    ProgressLogsModule,
    DeviceTokensModule,
    RemindersModule,
    UserSettingsModule,
  ],
})
export class AppModule {}
