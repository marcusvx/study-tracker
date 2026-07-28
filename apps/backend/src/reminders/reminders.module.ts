import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyItemEntity } from '../study-items/study-item.entity';
import { DeviceTokensModule } from '../device-tokens/device-tokens.module';
import { ReminderSendEntity } from './reminder-send.entity';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { CallerAuthGuard } from '../auth/caller-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyItemEntity, ReminderSendEntity]),
    DeviceTokensModule,
  ],
  providers: [RemindersService, CallerAuthGuard],
  controllers: [RemindersController],
})
export class RemindersModule {}
