import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CallerAuthGuard } from '../auth/caller-auth.guard';
import {
  RemindersService,
  type ReminderDispatchResult,
  type ReminderScanResult,
} from './reminders.service';

@Controller('internal/reminders')
@UseGuards(CallerAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  /** Dry-run: list reminders due in the current window (no writes). */
  @Get('pending')
  pending(): Promise<ReminderScanResult> {
    return this.remindersService.findPending();
  }

  /** Record due reminders for today. Push provider wiring comes later. */
  @Post('dispatch')
  dispatch(): Promise<ReminderDispatchResult> {
    return this.remindersService.dispatch();
  }
}
