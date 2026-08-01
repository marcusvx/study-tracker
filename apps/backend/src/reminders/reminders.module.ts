import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { CallerAuthGuard } from '../auth/caller-auth.guard';

@Module({
  providers: [RemindersService, CallerAuthGuard],
  controllers: [RemindersController],
})
export class RemindersModule {}
