import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CallerAuthGuard } from '../auth/caller-auth.guard';
import { AppLogger, withSpan } from '../telemetry/app-logger';
import {
  RemindersService,
  type ReminderDispatchResult,
  type ReminderScanResult,
} from './reminders.service';

@Controller('internal/reminders')
@UseGuards(CallerAuthGuard)
export class RemindersController {
  private readonly logger = new AppLogger(RemindersController.name);

  constructor(private readonly remindersService: RemindersService) {}

  /** Dry-run: list reminders due in the current window (no writes). */
  @Get('pending')
  pending(@Req() req: Request): Promise<ReminderScanResult> {
    return withSpan(
      'http.internal.reminders.pending',
      async () => {
        this.logger.info('GET /internal/reminders/pending', {
          'http.client_ip': req.ip ?? 'unknown',
        });

        const result = await this.remindersService.findPending();

        this.logger.info('GET /internal/reminders/pending completed', {
          'reminders.pending': result.pending.length,
          'reminders.skipped_already_sent': result.skippedAlreadySent,
          'reminders.skipped_no_token': result.skippedNoToken,
        });

        return result;
      },
    );
  }

  /** Record due reminders for today. Push provider wiring comes later. */
  @Post('dispatch')
  dispatch(@Req() req: Request): Promise<ReminderDispatchResult> {
    return withSpan(
      'http.internal.reminders.dispatch',
      async () => {
        this.logger.info('POST /internal/reminders/dispatch', {
          'http.client_ip': req.ip ?? 'unknown',
        });

        const result = await this.remindersService.dispatch();

        this.logger.info('POST /internal/reminders/dispatch completed', {
          'reminders.recorded': result.recorded,
          'reminders.pending': result.pending.length,
          'reminders.skipped_already_sent': result.skippedAlreadySent,
          'reminders.skipped_no_token': result.skippedNoToken,
          'reminders.delivery': result.delivery,
        });

        return result;
      },
    );
  }
}
